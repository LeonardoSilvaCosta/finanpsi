import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPost } from "@prisma/client";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { CommentsSection } from "@/components/blog/Comments";
import { getPostUrl, formatCategory } from "@/lib/blog/utils";
import { CommentFormClient } from "./CommentFormClient";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        comments: {
          where: {
            isApproved: true,
            isSpam: false,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post || post.status !== "PUBLISHED") {
      return null;
    }

    if (post.publishedAt && new Date(post.publishedAt) > new Date()) {
      return null;
    }

    // Incrementar views
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return post;
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post não encontrado",
    };
  }

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || "";
  const image = post.featuredImage || post.thumbnailImage || "";
  const url = getPostUrl(post.slug, post.contentType);

  return {
    title,
    description,
    keywords: post.metaKeywords.length > 0 ? post.metaKeywords.join(", ") : undefined,
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image }] : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Buscar posts relacionados
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      id: { not: post.id },
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
      OR: [
        { category: post.category },
        { tags: { hasSome: post.tags } },
      ],
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  // Buscar comentários aprovados
  const allComments = await prisma.blogComment.findMany({
    where: {
      blogPostId: post.id,
      isApproved: true,
      isSpam: false,
    },
    orderBy: { createdAt: "asc" },
  });

  // Separar comentários principais dos replies
  const topLevelComments = allComments.filter((c) => !c.parentId);
  const repliesByParent = allComments
    .filter((c) => c.parentId)
    .reduce((acc, reply) => {
      if (!acc[reply.parentId!]) {
        acc[reply.parentId!] = [];
      }
      acc[reply.parentId!].push(reply);
      return acc;
    }, {} as Record<string, typeof allComments>);

  const comments = topLevelComments.map((comment) => ({
    ...comment,
    replies: repliesByParent[comment.id] || [],
  }));

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Header do post */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-4">
            <span className="text-sm font-semibold text-finansi-primary uppercase tracking-wide">
              {formatCategory(post.category)}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Por {post.authorName}</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {post.publishedAt.toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
            {post.views > 0 && <span>{post.views} visualizações</span>}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Compartilhar */}
        <div className="mb-8">
          <ShareButtons post={post} />
        </div>

        {/* Conteúdo do post */}
        <BlogPostContent post={post} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="my-12">
          <NewsletterCTA postId={post.id} location="post_bottom" />
        </div>

        {/* Comentários */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comentários ({comments.length})
          </h2>
          <CommentsSection comments={comments} postId={post.id} />
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Deixe seu comentário
            </h3>
            <CommentFormClient postId={post.id} />
          </div>
        </div>

        {/* Posts relacionados */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
        )}
      </div>
    </article>
  );
}


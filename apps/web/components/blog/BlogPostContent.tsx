"use client";

import { BlogPost, BlogContentType } from "@prisma/client";
import { VideoPlayer } from "@/components/blog/VideoPlayer";
import { PodcastPlayer } from "@/components/blog/PodcastPlayer";
import { LiveEvent } from "@/components/blog/LiveEvent";
import Image from "next/image";
import { calculateReadingTime } from "@/lib/blog/utils";
import { Clock } from "lucide-react";

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="prose prose-lg max-w-none">
      {/* Imagem destacada */}
      {post.featuredImage && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>
      )}

      {/* Player de vídeo */}
      {post.contentType === BlogContentType.VIDEO && post.videoUrl && (
        <div className="mb-8">
          <VideoPlayer post={post} />
        </div>
      )}

      {/* Player de podcast */}
      {post.contentType === BlogContentType.PODCAST && (
        <div className="mb-8">
          <PodcastPlayer post={post} />
        </div>
      )}

      {/* Live */}
      {post.contentType === BlogContentType.LIVE && (
        <div className="mb-8">
          <LiveEvent post={post} />
        </div>
      )}

      {/* Tempo de leitura */}
      {post.contentType === BlogContentType.POST && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Clock className="w-4 h-4" />
          <span>{readingTime} min de leitura</span>
        </div>
      )}

      {/* Conteúdo */}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}


"use client";

import { useState } from "react";
import { BlogPost } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { formatRelativeDate, getPostUrl } from "@/lib/blog/utils";
import { BlogEvents } from "@/lib/blog/analytics";

interface RelatedPostsProps {
  posts: BlogPost[];
  currentPostId: string;
  limit?: number;
}

export function RelatedPosts({ posts, currentPostId, limit = 3 }: RelatedPostsProps) {
  const filteredPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, limit);

  if (filteredPosts.length === 0) {
    return null;
  }

  const handleClick = (postId: string, title: string) => {
    BlogEvents.postClick(postId, title, "RELATED" as any);
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Conteúdo Relacionado
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const postUrl = getPostUrl(post.slug, post.contentType);
          
          return (
            <Link
              key={post.id}
              href={postUrl}
              onClick={() => handleClick(post.id, post.title)}
              className="group block"
            >
              <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                {post.thumbnailImage && (
                  <div className="relative w-full h-40 overflow-hidden bg-gray-100">
                    <Image
                      src={post.thumbnailImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-finansi-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <time className="text-xs text-gray-500">
                    {post.publishedAt
                      ? formatRelativeDate(post.publishedAt)
                      : "Em breve"}
                  </time>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


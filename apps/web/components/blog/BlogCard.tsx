"use client";

import Link from "next/link";
import Image from "next/image";
import { BlogPost, BlogCategory, BlogContentType } from "@prisma/client";
import { formatDate, formatRelativeDate, formatCategory, formatContentType, getPostUrl, calculateReadingTime } from "@/lib/blog/utils";
import { BlogEvents } from "@/lib/blog/analytics";
import { Clock, Eye, Heart, Share2, Play, Headphones, Radio } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  showExcerpt?: boolean;
  showStats?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BlogCard({ 
  post, 
  showExcerpt = true, 
  showStats = true,
  size = "md" 
}: BlogCardProps) {
  const postUrl = getPostUrl(post.slug, post.contentType);
  const readingTime = calculateReadingTime(post.content);
  
  const sizeClasses = {
    sm: "h-48",
    md: "h-64",
    lg: "h-80",
  };

  const getContentTypeIcon = () => {
    switch (post.contentType) {
      case BlogContentType.VIDEO:
        return <Play className="w-4 h-4" />;
      case BlogContentType.PODCAST:
        return <Headphones className="w-4 h-4" />;
      case BlogContentType.LIVE:
        return <Radio className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    BlogEvents.postClick(post.id, post.title, post.category);
  };

  return (
    <article className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
      <Link href={postUrl} onClick={handleClick} className="block">
        {/* Imagem destacada */}
        {post.thumbnailImage || post.featuredImage ? (
          <div className={`relative w-full ${sizeClasses[size]} overflow-hidden bg-gray-100`}>
            <Image
              src={post.thumbnailImage || post.featuredImage || ""}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Badge de tipo de conteúdo */}
            {post.contentType !== BlogContentType.POST && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-finansi-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                {getContentTypeIcon()}
                <span>{formatContentType(post.contentType)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className={`w-full ${sizeClasses[size]} bg-gradient-to-br from-finansi-primary/10 to-finansi-secondary/10 flex items-center justify-center`}>
            <div className="text-finansi-primary opacity-20">
              {getContentTypeIcon() || <Eye className="w-16 h-16" />}
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Categoria */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-finansi-primary uppercase tracking-wide">
              {formatCategory(post.category)}
            </span>
            {post.contentType !== BlogContentType.POST && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {getContentTypeIcon()}
              </div>
            )}
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-finansi-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          {showExcerpt && post.excerpt && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats e metadata */}
          {showStats && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                {post.contentType === BlogContentType.POST && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{readingTime} min</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{post.views}</span>
                </div>
                {post.likes > 0 && (
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{post.likes}</span>
                  </div>
                )}
              </div>
              <time dateTime={post.publishedAt?.toISOString()}>
                {post.publishedAt
                  ? formatRelativeDate(post.publishedAt)
                  : "Em breve"}
              </time>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}


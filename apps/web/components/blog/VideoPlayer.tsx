"use client";

import { useState, useEffect } from "react";
import { BlogPost } from "@prisma/client";
import { extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/blog/utils";
import { BlogEvents } from "@/lib/blog/analytics";
import { Play, ExternalLink } from "lucide-react";

interface VideoPlayerProps {
  post: BlogPost;
}

export function VideoPlayer({ post }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = post.videoUrl ? extractYouTubeId(post.videoUrl) : null;
  const embedUrl = videoId ? getYouTubeEmbedUrl(videoId) : null;

  useEffect(() => {
    if (isPlaying && embedUrl) {
      BlogEvents.videoPlay(post.id, post.videoPlatform || "youtube");
    }
  }, [isPlaying, embedUrl, post.id, post.videoPlatform]);

  if (!videoId && !post.videoUrl) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white">
        <p>Vídeo não disponível</p>
      </div>
    );
  }

  if (!isPlaying && embedUrl) {
    return (
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <div
          className="absolute inset-0 cursor-pointer flex items-center justify-center"
          onClick={() => setIsPlaying(true)}
        >
          <div className="absolute inset-0 bg-black/40" />
          {post.thumbnailImage && (
            <img
              src={post.thumbnailImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          )}
          <button className="relative z-10 w-20 h-20 bg-finansi-primary rounded-full flex items-center justify-center hover:bg-finansi-primary/90 transition-colors">
            <Play className="w-10 h-10 text-white ml-1" fill="white" />
          </button>
        </div>
        {post.videoUrl && (
          <a
            href={post.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir no YouTube</span>
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
      {embedUrl && (
        <iframe
          src={`${embedUrl}?autoplay=1&rel=0`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={post.title}
        />
      )}
    </div>
  );
}


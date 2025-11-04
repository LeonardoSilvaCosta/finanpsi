"use client";

import { useState, useEffect } from "react";
import { BlogPost } from "@prisma/client";
import { formatDate, formatRelativeDate } from "@/lib/blog/utils";
import { BlogEvents } from "@/lib/blog/analytics";
import { Calendar, Clock, Radio, ExternalLink, Play } from "lucide-react";

interface LiveEventProps {
  post: BlogPost;
}

export function LiveEvent({ post }: LiveEventProps) {
  const [hasViewed, setHasViewed] = useState(false);
  const isRecorded = Boolean(post.isRecorded && post.recordedUrl);
  const isUpcoming = post.liveDate ? new Date(post.liveDate) > new Date() : false;
  const liveDate = post.liveDate ? new Date(post.liveDate) : null;

  const handleView = () => {
    if (!hasViewed) {
      setHasViewed(true);
      BlogEvents.liveView(post.id, isRecorded);
    }
  };

  useEffect(() => {
    if (isRecorded || !isUpcoming) {
      handleView();
    }
  }, []);

  if (isUpcoming && liveDate) {
    // Live agendada
    return (
      <div className="bg-gradient-to-r from-finansi-primary to-finansi-secondary rounded-xl p-8 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Radio className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Live Agendada</h2>
          <div className="flex items-center justify-center gap-2 mb-4 text-lg">
            <Calendar className="w-5 h-5" />
            <time dateTime={liveDate.toISOString()}>
              {formatDate(liveDate)}
            </time>
          </div>
          {post.liveUrl && (
            <a
              href={post.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-finansi-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              onClick={handleView}
            >
              <ExternalLink className="w-5 h-5" />
              <span>Acessar Live</span>
            </a>
          )}
          <p className="mt-4 text-finansi-primary-50">
            Adicione este evento ao seu calendário e não perca!
          </p>
        </div>
      </div>
    );
  }

  if (isRecorded && post.recordedUrl) {
    // Live gravada
    return (
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-finansi-primary rounded-full flex items-center justify-center">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Live Gravada
            </h3>
            {liveDate && (
              <p className="text-sm text-gray-600">
                Realizada em {formatDate(liveDate)}
              </p>
            )}
          </div>
        </div>
        
        <a
          href={post.recordedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-finansi-primary text-white rounded-lg font-semibold hover:bg-finansi-primary/90 transition-colors"
          onClick={handleView}
        >
          <Play className="w-5 h-5" />
          <span>Assistir Gravação</span>
        </a>
      </div>
    );
  }

  // Live ao vivo (em andamento)
  return (
    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        <span className="font-semibold text-red-700">AO VIVO</span>
      </div>
      {post.liveUrl && (
        <a
          href={post.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          onClick={handleView}
        >
          <Radio className="w-5 h-5" />
          <span>Assistir Agora</span>
        </a>
      )}
    </div>
  );
}


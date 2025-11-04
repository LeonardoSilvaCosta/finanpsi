"use client";

import { useState } from "react";
import { BlogPost } from "@prisma/client";
import { formatDuration } from "@/lib/blog/utils";
import { BlogEvents } from "@/lib/blog/analytics";
import { Play, Pause, Download, FileText } from "lucide-react";

interface PodcastPlayerProps {
  post: BlogPost;
}

export function PodcastPlayer({ post }: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      BlogEvents.podcastPlay(post.id);
    }
  };

  const handleDownloadTranscript = () => {
    if (post.transcript) {
      const blob = new Blob([post.transcript], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${post.slug}-transcricao.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      BlogEvents.transcriptDownload(post.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Player de áudio */}
      {post.audioUrl && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlay}
              className="w-14 h-14 bg-finansi-primary text-white rounded-full flex items-center justify-center hover:bg-finansi-primary/90 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" fill="white" />
              ) : (
                <Play className="w-6 h-6 ml-1" fill="white" />
              )}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {post.title}
                </span>
                {post.videoDuration && (
                  <span className="text-sm text-gray-500">
                    {formatDuration(post.videoDuration)}
                  </span>
                )}
              </div>
              
              <audio
                src={post.audioUrl}
                controls
                className="w-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => {
                  const audio = e.currentTarget;
                  setCurrentTime(audio.currentTime);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Transcrição */}
      {post.transcript && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Transcrição
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>{showTranscript ? "Ocultar" : "Mostrar"} transcrição</span>
              </button>
              <button
                onClick={handleDownloadTranscript}
                className="flex items-center gap-2 px-4 py-2 bg-finansi-primary text-white rounded-lg hover:bg-finansi-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Baixar</span>
              </button>
            </div>
          </div>
          
          {showTranscript && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {post.transcript}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


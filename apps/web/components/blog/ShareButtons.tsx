"use client";

import { useState } from "react";
import { BlogPost, BlogCategory } from "@prisma/client";
import { getShareUrl } from "@/lib/blog/utils";
import { BlogEvents } from "@/lib/blog/analytics";
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Link as LinkIcon } from "lucide-react";

interface ShareButtonsProps {
  post: BlogPost;
  url?: string;
}

export function ShareButtons({ post, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const postUrl = url || typeof window !== "undefined" 
    ? `${window.location.origin}/blog/${post.slug}`
    : "";

  const handleShare = (platform: string) => {
    const shareUrl = getShareUrl(
      platform as any,
      postUrl,
      post.title,
      post.excerpt || undefined
    );
    
    window.open(shareUrl, "_blank", "width=600,height=400");
    
    BlogEvents.postShare(post.id, platform, postUrl);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      BlogEvents.postShare(post.id, "copy", postUrl);
    } catch (err) {
      console.error("Erro ao copiar link:", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Compartilhar:</span>
      
      <button
        onClick={() => handleShare("facebook")}
        className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors"
        aria-label="Compartilhar no Facebook"
      >
        <Facebook className="w-4 h-4" />
        <span className="text-sm">Facebook</span>
      </button>

      <button
        onClick={() => handleShare("twitter")}
        className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A91DA] transition-colors"
        aria-label="Compartilhar no Twitter"
      >
        <Twitter className="w-4 h-4" />
        <span className="text-sm">Twitter</span>
      </button>

      <button
        onClick={() => handleShare("linkedin")}
        className="flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors"
        aria-label="Compartilhar no LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
        <span className="text-sm">LinkedIn</span>
      </button>

      <button
        onClick={() => handleShare("whatsapp")}
        className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#22C55E] transition-colors"
        aria-label="Compartilhar no WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm">WhatsApp</span>
      </button>

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        aria-label="Copiar link"
      >
        <LinkIcon className="w-4 h-4" />
        <span className="text-sm">{copied ? "Copiado!" : "Copiar link"}</span>
      </button>
    </div>
  );
}


import { trackEvent } from "@/lib/analytics";
import { BlogCategory, BlogContentType } from "@prisma/client";

/**
 * Eventos de Analytics para o Blog
 */
export const BlogEvents = {
  /**
   * Visualização de página do blog
   */
  blogPageView: (category?: BlogCategory, contentType?: BlogContentType) => {
    trackEvent("blog_page_view", {
      category: category || "all",
      contentType: contentType || "all",
    });
  },

  /**
   * Visualização de post individual
   */
  postView: (postId: string, title: string, category: BlogCategory, contentType: BlogContentType) => {
    trackEvent("blog_post_view", {
      postId,
      title,
      category,
      contentType,
    });
  },

  /**
   * Clique em post (card)
   */
  postClick: (postId: string, title: string, category: BlogCategory) => {
    trackEvent("blog_post_click", {
      postId,
      title,
      category,
    });
  },

  /**
   * Busca no blog
   */
  blogSearch: (query: string, resultsCount: number) => {
    trackEvent("blog_search", {
      query,
      resultsCount,
    });
  },

  /**
   * Filtro aplicado
   */
  blogFilter: (filterType: "category" | "tag" | "contentType", value: string) => {
    trackEvent("blog_filter", {
      filterType,
      value,
    });
  },

  /**
   * Like em post
   */
  postLike: (postId: string, liked: boolean) => {
    trackEvent("blog_post_like", {
      postId,
      liked,
    });
  },

  /**
   * Compartilhamento
   */
  postShare: (postId: string, platform: string, url: string) => {
    trackEvent("blog_post_share", {
      postId,
      platform,
      url,
    });
  },

  /**
   * Comentário enviado
   */
  commentSubmit: (postId: string, hasParent: boolean) => {
    trackEvent("blog_comment_submit", {
      postId,
      hasParent,
    });
  },

  /**
   * Inscrição na newsletter
   */
  newsletterSubscribe: (email: string, categories?: BlogCategory[]) => {
    trackEvent("blog_newsletter_subscribe", {
      email,
      categories: categories || [],
    });
  },

  /**
   * Clique em CTA
   */
  ctaClick: (postId: string, ctaType: string, location: string) => {
    trackEvent("blog_cta_click", {
      postId,
      ctaType,
      location,
    });
  },

  /**
   * Reprodução de vídeo
   */
  videoPlay: (postId: string, videoPlatform: string) => {
    trackEvent("blog_video_play", {
      postId,
      videoPlatform,
    });
  },

  /**
   * Reprodução de podcast
   */
  podcastPlay: (postId: string) => {
    trackEvent("blog_podcast_play", {
      postId,
    });
  },

  /**
   * Download de transcrição
   */
  transcriptDownload: (postId: string) => {
    trackEvent("blog_transcript_download", {
      postId,
    });
  },

  /**
   * Visualização de live agendada
   */
  liveView: (postId: string, isRecorded: boolean) => {
    trackEvent("blog_live_view", {
      postId,
      isRecorded,
    });
  },
};


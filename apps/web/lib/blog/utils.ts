import { BlogCategory, BlogContentType, BlogStatus } from "@prisma/client";

/**
 * Gera um slug a partir de um título
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]+/g, "-") // Substitui caracteres especiais por hífen
    .replace(/(^-|-$)/g, ""); // Remove hífens no início e fim
}

/**
 * Formata categoria para exibição
 */
export function formatCategory(category: BlogCategory): string {
  const categoryMap: Record<BlogCategory, string> = {
    FINANCAS_COMPORTAMENTAIS: "Finanças Comportamentais",
    SAUDE_EMOCIONAL_DINHEIRO: "Saúde Emocional & Dinheiro",
    PLANEJAMENTO_PRATICO: "Planejamento Prático",
    TENDENCIAS_MERCADO: "Tendências e Mercado",
    CASOS_SUCESSO: "Casos de Sucesso",
    GERAL: "Geral",
  };
  return categoryMap[category] || category;
}

/**
 * Formata tipo de conteúdo para exibição
 */
export function formatContentType(type: BlogContentType): string {
  const typeMap: Record<BlogContentType, string> = {
    POST: "Artigo",
    VIDEO: "Vídeo",
    PODCAST: "Podcast",
    LIVE: "Live",
  };
  return typeMap[type] || type;
}

/**
 * Extrai ID do vídeo do YouTube
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Gera URL de embed do YouTube
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Formata data para exibição
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Formata data relativa (ex: "há 2 dias")
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? "agora" : `há ${diffMins} minutos`;
    }
    return diffHours === 1 ? "há 1 hora" : `há ${diffHours} horas`;
  }

  if (diffDays === 1) return "ontem";
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "há 1 semana" : `há ${weeks} semanas`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "há 1 mês" : `há ${months} meses`;
  }

  const years = Math.floor(diffDays / 365);
  return years === 1 ? "há 1 ano" : `há ${years} anos`;
}

/**
 * Formata duração de vídeo/áudio (segundos para MM:SS)
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Trunca texto para um determinado comprimento
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Gera excerpt a partir do conteúdo
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, "").trim();
  return truncateText(plainText, maxLength);
}

/**
 * Valida se um slug é válido
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Gera URL completa do post
 */
export function getPostUrl(slug: string, contentType?: BlogContentType): string {
  const basePath = contentType === BlogContentType.VIDEO 
    ? "/blog/videos" 
    : contentType === BlogContentType.PODCAST 
    ? "/blog/podcasts" 
    : contentType === BlogContentType.LIVE 
    ? "/blog/lives" 
    : "/blog";
  
  return `${basePath}/${slug}`;
}

/**
 * Gera URL de compartilhamento
 */
export function getShareUrl(
  platform: "facebook" | "twitter" | "linkedin" | "whatsapp" | "telegram",
  url: string,
  title: string,
  text?: string
): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text || title);

  const shareUrls: Record<string, string> = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
  };

  return shareUrls[platform] || url;
}

/**
 * Calcula tempo de leitura estimado
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const plainText = content.replace(/<[^>]*>/g, "");
  const wordCount = plainText.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Verifica se um post está publicado
 */
export function isPublished(
  status: BlogStatus,
  publishedAt: Date | string | null
): boolean {
  if (status !== BlogStatus.PUBLISHED) return false;
  if (!publishedAt) return false;
  
  const published = typeof publishedAt === "string" 
    ? new Date(publishedAt) 
    : publishedAt;
  
  return published <= new Date();
}


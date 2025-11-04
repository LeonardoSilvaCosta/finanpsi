import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getPostUrl } from "@/lib/blog/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://finanpsi.com.br";

  // URLs estáticas
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/thank-you`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Tentar buscar posts do banco (pode falhar durante build se DATABASE_URL não estiver disponível)
  let postUrls: MetadataRoute.Sitemap = [];
  
  try {
    // Verificar se DATABASE_URL está disponível
    if (!process.env.DATABASE_URL) {
      console.warn("[Sitemap] DATABASE_URL não disponível, retornando apenas URLs estáticas");
      return staticUrls;
    }

    // Buscar todos os posts publicados
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
      },
      select: {
        slug: true,
        contentType: true,
        updatedAt: true,
        publishedAt: true,
      },
    });

    // Mapear posts para URLs do sitemap
    postUrls = posts.map((post) => ({
      url: `${baseUrl}${getPostUrl(post.slug, post.contentType)}`,
      lastModified: post.updatedAt || post.publishedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    // Se falhar (ex: durante build estático sem banco), retornar apenas URLs estáticas
    console.warn("[Sitemap] Erro ao buscar posts, retornando apenas URLs estáticas:", error);
  }

  return [...staticUrls, ...postUrls];
}


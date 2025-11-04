import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BlogCategory, BlogContentType, BlogStatus } from "@prisma/client";
import { generateSlug } from "@/lib/blog/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Filtros
    const category = searchParams.get("category") as BlogCategory | null;
    const contentType = searchParams.get("contentType") as BlogContentType | null;
    const status = searchParams.get("status") as BlogStatus | null;
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    
    // Construir filtros
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (contentType) {
      where.contentType = contentType;
    }
    
    if (status) {
      where.status = status;
    } else {
      // Por padrão, apenas posts publicados
      where.status = BlogStatus.PUBLISHED;
      where.publishedAt = {
        lte: new Date(),
      };
    }
    
    if (tag) {
      where.tags = {
        has: tag,
      };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } },
      ];
    }
    
    // Buscar posts
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: [
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: {
              comments: {
                where: {
                  isApproved: true,
                },
              },
            },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);
    
    return NextResponse.json({
      posts,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("[Blog API] Erro ao buscar posts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      contentType = BlogContentType.POST,
      category = BlogCategory.GERAL,
      tags = [],
      metaTitle,
      metaDescription,
      metaKeywords = [],
      featuredImage,
      thumbnailImage,
      videoUrl,
      videoPlatform,
      videoDuration,
      audioUrl,
      transcript,
      episodeNumber,
      liveDate,
      liveUrl,
      isRecorded,
      recordedUrl,
      status = BlogStatus.DRAFT,
      publishedAt,
      scheduledAt,
      authorName = "Equipe FinanPsi",
      authorEmail,
    } = body;
    
    // Validar dados obrigatórios
    if (!title || !content) {
      return NextResponse.json(
        { error: "Título e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }
    
    // Gerar slug se não fornecido
    const finalSlug = slug || generateSlug(title);
    
    // Verificar se slug já existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: finalSlug },
    });
    
    if (existingPost) {
      return NextResponse.json(
        { error: "Um post com este slug já existe" },
        { status: 400 }
      );
    }
    
    // Criar post
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        contentType,
        category,
        tags,
        metaTitle,
        metaDescription,
        metaKeywords,
        featuredImage,
        thumbnailImage,
        videoUrl,
        videoPlatform,
        videoDuration,
        audioUrl,
        transcript,
        episodeNumber,
        liveDate: liveDate ? new Date(liveDate) : null,
        liveUrl,
        isRecorded: isRecorded || false,
        recordedUrl,
        status,
        publishedAt: publishedAt ? new Date(publishedAt) : status === BlogStatus.PUBLISHED ? new Date() : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        authorName,
        authorEmail,
      },
    });
    
    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    console.error("[Blog API] Erro ao criar post:", error);
    return NextResponse.json(
      { error: "Erro ao criar post" },
      { status: 500 }
    );
  }
}


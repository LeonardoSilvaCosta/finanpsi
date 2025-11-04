import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BlogStatus } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: "Slug é obrigatório" },
        { status: 400 }
      );
    }
    
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        comments: {
          where: {
            isApproved: true,
            isSpam: false,
          },
          orderBy: {
            createdAt: "asc",
          },
          include: {
            replies: {
              where: {
                isApproved: true,
                isSpam: false,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
        _count: {
          select: {
            comments: {
              where: {
                isApproved: true,
              },
            },
            engagements: true,
          },
        },
      },
    });
    
    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }
    
    // Verificar se está publicado
    if (post.status !== BlogStatus.PUBLISHED) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }
    
    if (post.publishedAt && new Date(post.publishedAt) > new Date()) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }
    
    // Incrementar views
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    
    // Registrar engajamento de view
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    
    await prisma.blogEngagement.create({
      data: {
        blogPostId: post.id,
        type: "view",
        userIp: clientIp,
        userAgent,
      },
    }).catch(() => {
      // Ignorar erro se já existe (unique constraint)
    });
    
    return NextResponse.json({ post });
  } catch (error: any) {
    console.error("[Blog API] Erro ao buscar post:", error);
    return NextResponse.json(
      { error: "Erro ao buscar post" },
      { status: 500 }
    );
  }
}


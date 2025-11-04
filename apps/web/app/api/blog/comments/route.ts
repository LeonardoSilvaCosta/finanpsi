import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limiting
  const rateLimit = rateLimitMiddleware(req, {
    maxRequests: 3,
    windowMs: 15 * 60 * 1000, // 15 minutos
  });

  if (rateLimit && !rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Muitas requisições. Tente novamente mais tarde.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { postId, parentId, authorName, authorEmail, authorUrl, content } = body;

    // Validar dados obrigatórios
    if (!postId || !authorName || !authorEmail || !content) {
      return NextResponse.json(
        { error: "Dados obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Verificar se post existe
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se parent existe (se for resposta)
    if (parentId) {
      const parent = await prisma.blogComment.findUnique({
        where: { id: parentId },
      });

      if (!parent || parent.blogPostId !== postId) {
        return NextResponse.json(
          { error: "Comentário pai inválido" },
          { status: 400 }
        );
      }
    }

    // Criar comentário (aguardando aprovação)
    const comment = await prisma.blogComment.create({
      data: {
        blogPostId: postId,
        parentId: parentId || null,
        authorName,
        authorEmail,
        authorUrl: authorUrl || null,
        content,
        isApproved: false, // Requer aprovação manual
      },
    });

    return NextResponse.json(
      {
        comment,
        message: "Comentário enviado! Aguardando aprovação.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Blog API] Erro ao criar comentário:", error);
    return NextResponse.json(
      { error: "Erro ao criar comentário" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limiting
  const rateLimit = rateLimitMiddleware(req, {
    maxRequests: 10,
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
    const { postId, type = "like" } = body;

    if (!postId) {
      return NextResponse.json(
        { error: "postId é obrigatório" },
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

    // Identificar usuário
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const sessionId = req.headers.get("x-session-id") || null;

    // Verificar se já existe engajamento
    const existing = await prisma.blogEngagement.findUnique({
      where: {
        blogPostId_type_userIp_sessionId: {
          blogPostId: postId,
          type,
          userIp: clientIp,
          sessionId: sessionId || "",
        },
      },
    });

    if (existing) {
      // Já existe, retornar sucesso mas não criar duplicado
      return NextResponse.json({
        success: true,
        alreadyExists: true,
      });
    }

    // Criar engajamento
    await prisma.blogEngagement.create({
      data: {
        blogPostId: postId,
        type,
        userIp: clientIp,
        userAgent,
        sessionId,
      },
    });

    // Atualizar contador no post
    const updateField: any = {};
    if (type === "like") {
      updateField.likes = { increment: 1 };
    } else if (type === "share") {
      updateField.shares = { increment: 1 };
    }

    if (Object.keys(updateField).length > 0) {
      await prisma.blogPost.update({
        where: { id: postId },
        data: updateField,
      });
    }

    return NextResponse.json({
      success: true,
      type,
    });
  } catch (error: any) {
    console.error("[Blog API] Erro ao registrar engajamento:", error);
    
    // Se for erro de constraint única, considerar como sucesso
    if (error.code === "P2002") {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
      });
    }

    return NextResponse.json(
      { error: "Erro ao registrar engajamento" },
      { status: 500 }
    );
  }
}


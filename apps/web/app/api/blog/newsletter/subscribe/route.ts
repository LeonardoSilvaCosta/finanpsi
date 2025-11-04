import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BlogCategory } from "@prisma/client";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limiting
  const rateLimit = rateLimitMiddleware(req, {
    maxRequests: 5,
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
    const { email, name, categories = [], tags = [] } = body;

    // Validar email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Verificar se já existe
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "Este email já está inscrito" },
          { status: 400 }
        );
      } else {
        // Reativar inscrição
        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: {
            isActive: true,
            name: name || existing.name,
            categories: categories.length > 0 ? categories : existing.categories,
            tags: tags.length > 0 ? tags : existing.tags,
            unsubscribedAt: null,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Inscrição reativada com sucesso!",
        });
      }
    }

    // Criar nova inscrição
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        name: name || null,
        categories: categories as BlogCategory[],
        tags,
        isActive: true,
        isVerified: false, // Requer verificação por email (implementar depois)
      },
    });

    // TODO: Enviar email de verificação

    return NextResponse.json(
      {
        success: true,
        message: "Inscrição realizada com sucesso! Verifique seu email.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Blog API] Erro ao inscrever newsletter:", error);
    return NextResponse.json(
      { error: "Erro ao realizar inscrição" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token && !email) {
      return NextResponse.json(
        { error: "Token ou email é obrigatório" },
        { status: 400 }
      );
    }

    let subscriber;
    if (token) {
      subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { unsubscribeToken: token },
      });
    } else {
      subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email: email! },
      });
    }

    if (!subscriber) {
      return NextResponse.json(
        { error: "Inscrição não encontrada" },
        { status: 404 }
      );
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Inscrição cancelada com sucesso.",
    });
  } catch (error: any) {
    console.error("[Blog API] Erro ao cancelar inscrição:", error);
    return NextResponse.json(
      { error: "Erro ao cancelar inscrição" },
      { status: 500 }
    );
  }
}


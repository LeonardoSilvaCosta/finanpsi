"use server";

import { prisma } from "@/lib/prisma";

export async function submitComment(data: {
  postId: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  content: string;
}) {
  try {
    // Verificar se post existe
    const post = await prisma.blogPost.findUnique({
      where: { id: data.postId },
    });

    if (!post) {
      throw new Error("Post não encontrado");
    }

    // Verificar se parent existe (se for resposta)
    if (data.parentId) {
      const parent = await prisma.blogComment.findUnique({
        where: { id: data.parentId },
      });

      if (!parent || parent.blogPostId !== data.postId) {
        throw new Error("Comentário pai inválido");
      }
    }

    // Criar comentário (aguardando aprovação)
    const comment = await prisma.blogComment.create({
      data: {
        blogPostId: data.postId,
        parentId: data.parentId || null,
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        authorUrl: data.authorUrl || null,
        content: data.content,
        isApproved: false, // Requer aprovação manual
      },
    });

    return { success: true, comment };
  } catch (error: any) {
    throw new Error(error.message || "Erro ao enviar comentário");
  }
}


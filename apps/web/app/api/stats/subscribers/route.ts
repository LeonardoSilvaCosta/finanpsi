import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/stats/subscribers
 * Retorna estatísticas de inscritos para o contador de urgência
 */
export async function GET() {
  try {
    // Contar total de leads inscritos
    // Como email é obrigatório no schema, contamos todos os leads
    const count = await prisma.lead.count();

    // Calcular estatísticas adicionais
    const todayCount = await prisma.lead.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const thisWeekCount = await prisma.lead.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    });

    return NextResponse.json({
      success: true,
      count,
      today: todayCount,
      thisWeek: thisWeekCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Stats API] Erro ao buscar estatísticas:", error);
    
    // Retornar valores padrão em caso de erro
    return NextResponse.json(
      {
        success: false,
        count: 0,
        today: 0,
        thisWeek: 0,
        error: "Erro ao buscar estatísticas",
      },
      { status: 500 }
    );
  }
}


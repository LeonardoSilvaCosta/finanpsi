import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/leads
 * Lista leads com filtros opcionais
 * TODO: Adicionar autenticação básica
 */
export async function GET(req: Request) {
  try {
    // TODO: Implementar autenticação básica
    // const authHeader = req.headers.get("authorization");
    // if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const profession = searchParams.get("profession");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Construir filtros
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (profession) {
      where.profession = { contains: profession, mode: "insensitive" };
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo + "T23:59:59");
      }
    }

    // Buscar leads
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 1000, // Limite de 1000 resultados
    });

    // Formatar dados para resposta
    const formattedLeads = leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      profession: lead.profession,
      challenge: lead.challenge,
      groupAccepted: lead.groupAccepted,
      diagnosis: lead.diagnosis,
      createdAt: lead.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      leads: formattedLeads,
      count: formattedLeads.length,
    });
  } catch (error: any) {
    console.error("[Admin Leads] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar leads" },
      { status: 500 }
    );
  }
}


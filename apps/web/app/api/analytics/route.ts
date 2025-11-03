import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";

/**
 * Endpoint para receber eventos de analytics server-side
 * Útil para eventos que não podem ser enviados do client-side
 * ou para agregar eventos de múltiplas fontes
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, category, properties, value } = body;

    if (!event || typeof event !== "string") {
      return NextResponse.json(
        { error: "Evento é obrigatório e deve ser uma string" },
        { status: 400 }
      );
    }

    // Trackar evento server-side
    trackEvent(event, properties, {
      category,
      value,
      serverSide: true,
    });

    return NextResponse.json({
      success: true,
      message: "Evento trackeado com sucesso",
    });
  } catch (error: any) {
    console.error("[Analytics API] Erro ao processar evento:", error);
    return NextResponse.json(
      { error: "Erro ao processar evento de analytics" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint para verificar status do analytics
 */
export async function GET() {
  try {
    const { getAnalyticsInfo } = await import("@/lib/analytics");
    const info = getAnalyticsInfo();

    return NextResponse.json({
      analytics: info,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Analytics API] Erro ao obter informações:", error);
    return NextResponse.json(
      { error: "Erro ao obter informações de analytics" },
      { status: 500 }
    );
  }
}


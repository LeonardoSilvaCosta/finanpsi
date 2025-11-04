import { NextResponse } from "next/server";
import {
  analyzeChallenge,
  generateDiagnosisSummary,
  type LeadData,
} from "@/lib/diagnosis";
import { generateDiagnosisWithFlowise } from "@/lib/flowise";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limiting - mais permissivo que o registro completo
  const rateLimit = rateLimitMiddleware(req, {
    maxRequests: Number(process.env.INSTANT_DIAGNOSIS_RATE_LIMIT || 10),
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000), // 15 minutos
  });

  if (rateLimit && !rateLimit.allowed) {
    console.warn(
      "[Instant Diagnosis Rate Limit] Requisição bloqueada:",
      rateLimit,
    );
    return NextResponse.json(
      {
        error: "Muitas requisições. Tente novamente mais tarde.",
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
          ),
          "X-RateLimit-Limit": String(
            process.env.INSTANT_DIAGNOSIS_RATE_LIMIT || 10,
          ),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.resetTime),
        },
      },
    );
  }

  try {
    const body = await req.json();
    const { challenge, profession, name, type = "basic" } = body;

    // Validar dados obrigatórios
    if (!challenge || challenge.trim().length < 10) {
      return NextResponse.json(
        { error: "Desafio é obrigatório e deve ter pelo menos 10 caracteres" },
        { status: 400 },
      );
    }

    const leadData: LeadData = {
      name: name || "Usuário",
      email: "", // Não necessário para diagnóstico instantâneo
      profession: profession || "",
      challenge: challenge,
      groupAccepted: false,
    };

    // Analisar o desafio
    const challengeAnalysis = analyzeChallenge(challenge);

    // Tipo de diagnóstico: "basic" (resumo rápido) ou "full" (completo com IA)
    if (type === "basic") {
      // Diagnóstico básico instantâneo (sem IA, apenas regras)
      const summary = generateDiagnosisSummary(leadData);

      const basicDiagnosis = {
        preview: true,
        category: challengeAnalysis.category,
        confidence: challengeAnalysis.confidence,
        summary: summary,
        keywords: challengeAnalysis.keywords,
        message: `Identificamos que seu principal desafio está relacionado a **${challengeAnalysis.category}**. ${summary}`,
        nextSteps: [
          "Complete seu cadastro para receber o diagnóstico completo e personalizado",
          "Participe da comunidade FinanPsi para suporte contínuo",
          "Receba dicas práticas e acionáveis por e-mail",
        ],
      };

      return NextResponse.json({
        success: true,
        diagnosis: basicDiagnosis,
        method: "rules",
        timestamp: new Date().toISOString(),
      });
    } else if (type === "full") {
      // Diagnóstico completo com IA (se disponível)
      let fullDiagnosis = "";
      let method = "rules";

      // Tentar usar Flowise se estiver configurado
      if (process.env.FLOWISE_BASE_URL) {
        try {
          const flowiseResult = await generateDiagnosisWithFlowise(leadData);

          if (flowiseResult.success && flowiseResult.diagnosis) {
            fullDiagnosis = flowiseResult.diagnosis;
            method = "flowise";
            console.log("[Instant Diagnosis] Diagnóstico gerado com Flowise");
          }
        } catch (error) {
          console.error("[Instant Diagnosis] Erro ao usar Flowise:", error);
          // Continuar com fallback
        }
      }

      // Fallback para diagnóstico baseado em regras
      if (!fullDiagnosis) {
        const { generateDiagnosis } = await import("@/lib/diagnosis");
        fullDiagnosis = generateDiagnosis(leadData);
        method = "rules";
        console.log("[Instant Diagnosis] Diagnóstico gerado com regras");
      }

      return NextResponse.json({
        success: true,
        diagnosis: {
          preview: false,
          category: challengeAnalysis.category,
          confidence: challengeAnalysis.confidence,
          fullText: fullDiagnosis,
          keywords: challengeAnalysis.keywords,
        },
        method: method,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: "Tipo de diagnóstico inválido. Use 'basic' ou 'full'." },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("[Instant Diagnosis] Erro:", error);
    return NextResponse.json(
      {
        error: "Erro ao gerar diagnóstico instantâneo",
        message: error.message || "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}

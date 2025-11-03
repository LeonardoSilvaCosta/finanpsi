import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import { generateDiagnosisAdvanced } from "@/lib/diagnosis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, profession, challenge, groupAccepted } = body;

    // Validar dados obrigatórios
    if (!email || !name) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }

    // Inserir no PostgreSQL via Prisma
    const lead = await prisma.lead.create({
      data: { name, email, profession, challenge, groupAccepted },
    });

    // Gerar diagnóstico financeiro usando sistema avançado (híbrido)
    let diagnosisText = "";
    let diagnosisMethod = "rules";
    let diagnosisResponseTime = 0;

    try {
      const diagnosisResult = await generateDiagnosisAdvanced(
        {
          name: lead.name,
          email: lead.email,
          profession: lead.profession,
          challenge: lead.challenge,
          groupAccepted: lead.groupAccepted,
        },
        {
          useCache: true, // Usar cache se disponível
          preferFlowise: process.env.DIAGNOSIS_PREFER_FLOWISE === "true", // Tentar Flowise se configurado
          fallbackToRules: true, // Sempre ter fallback
        }
      );

      diagnosisText = diagnosisResult.diagnosis;
      diagnosisMethod = diagnosisResult.method;
      diagnosisResponseTime = diagnosisResult.responseTime;

      // Atualizar lead com diagnóstico
      await prisma.lead.update({
        where: { id: lead.id },
        data: { diagnosis: diagnosisText },
      });

      console.log(`[Diagnóstico] Gerado com sucesso para lead ${lead.id}`);
      console.log(
        `[Diagnóstico] Método: ${diagnosisMethod}, Tempo: ${diagnosisResponseTime}ms`
      );

      if (diagnosisResult.flowiseAttempted) {
        console.log(
          `[Diagnóstico] Flowise tentado: ${
            diagnosisResult.flowiseSuccess ? "Sucesso" : "Falhou"
          }`
        );
      }
      if (diagnosisResult.cached) {
        console.log(`[Diagnóstico] Diagnóstico servido do cache`);
      }
    } catch (e: any) {
      console.error("[Diagnóstico] Erro ao gerar:", e);
      // Não falhar a requisição se o diagnóstico falhar
    }

    // Enviar ao n8n webhook
    let webhookSent = false;
    try {
      const webhookUrl = process.env.N8N_WEBHOOK_BASE;
      if (!webhookUrl) {
        console.warn("[Webhook] N8N_WEBHOOK_BASE não configurado");
      } else {
        // A URL do .env já deve incluir o caminho completo do webhook
        // Se termina com /leadCreated, não adicionar novamente
        const finalUrl = webhookUrl.endsWith("/leadCreated")
          ? webhookUrl
          : `${webhookUrl}/leadCreated`;

        console.log(`[Webhook] Enviando para: ${finalUrl}`);
        console.log(`[Webhook] Dados:`, JSON.stringify(lead, null, 2));

        // Criar AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

        const response = await fetch(finalUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          console.error(`[Webhook] Erro HTTP ${response.status}:`, errorText);
        } else {
          webhookSent = true;
          const responseData = await response.text().catch(() => "");
          console.log(`[Webhook] Sucesso:`, responseData);
        }
      }
    } catch (e: any) {
      const errorMessage = e.message || String(e);
      const errorName = e.name || "";
      console.error("[Webhook] Falha ao enviar:", errorMessage);
      if (
        errorName === "AbortError" ||
        errorMessage.includes("aborted") ||
        errorMessage.includes("timeout")
      ) {
        console.error("[Webhook] Timeout ao conectar com n8n (10s)");
      }
      // Não falhar a requisição se o webhook falhar
    }

    // Enviar email de boas-vindas (inclui diagnóstico se disponível)
    let emailSent = false;
    try {
      await sendWelcomeEmail(email, name, diagnosisText || undefined);
      emailSent = true;
    } catch (e) {
      console.error("sendWelcomeEmail fail", e);
    }

    return NextResponse.json({
      ok: true,
      emailSent,
      webhookSent,
      diagnosis: {
        generated: !!diagnosisText,
        method: diagnosisMethod,
        responseTime: diagnosisResponseTime,
      },
    });
  } catch (error) {
    console.error("Error in register route:", error);
    return NextResponse.json(
      { error: "Erro ao processar registro" },
      { status: 500 }
    );
  }
}

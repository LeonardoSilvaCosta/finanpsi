import type { LeadData } from "./diagnosis";

export interface FlowiseConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface FlowiseDiagnosisResponse {
  success: boolean;
  diagnosis?: string;
  error?: string;
  method?: "flowise" | "fallback";
  responseTime?: number;
}

/**
 * Configuração padrão do Flowise
 */
function getFlowiseConfig(): FlowiseConfig | null {
  const baseUrl =
    process.env.FLOWISE_BASE_URL || process.env.NEXT_PUBLIC_FLOWISE_URL;
  if (!baseUrl) {
    console.warn("[Flowise] FLOWISE_BASE_URL não configurado");
    return null;
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ""), // Remove trailing slash
    apiKey: process.env.FLOWISE_API_KEY,
    timeout: Number(process.env.FLOWISE_TIMEOUT || 30000), // 30 segundos padrão
  };
}

/**
 * Monta o prompt para o LLM baseado nos dados do lead
 */
function buildDiagnosisPrompt(lead: LeadData): string {
  const profession = lead.profession || "profissional";
  const challenge = lead.challenge || "desafios financeiros gerais";
  const groupInfo = lead.groupAccepted
    ? "O lead demonstrou interesse em participar de grupo de apoio."
    : "O lead não demonstrou interesse em grupo de apoio no momento.";

  return `Você é um consultor financeiro especializado em ajudar psicólogos e profissionais da saúde que são autônomos e enfrentam desafios financeiros.

Contexto do Lead:
- Nome: ${lead.name}
- Profissão: ${profession}
- Maior desafio financeiro: ${challenge}
- Interesse em grupo: ${groupInfo}

Gere um diagnóstico financeiro personalizado, profissional e acolhedor que:
1. Identifique o principal desafio mencionado
2. Forneça análises e ações práticas e específicas
3. Considere a realidade de profissionais autônomos da área de saúde
4. Mantenha um tom empático e encorajador
5. Inclua passos de ação concretos e realizáveis
6. Seja relevante para a situação específica do lead

Formato desejado:
- Saudação personalizada
- Identificação da situação/diagnóstico
- Ações recomendadas (bullet points)
- Insights específicos para profissionais da saúde (se aplicável)
- Mensagem sobre comunidade (se aplicável)
- Assinatura da Equipe FinanPsi

Mantenha o diagnóstico focado, prático e acolhedor. Evite jargões técnicos complexos demais.`;
}

/**
 * Chama o Flowise para gerar diagnóstico via IA
 */
export async function generateDiagnosisWithFlowise(
  lead: LeadData
): Promise<FlowiseDiagnosisResponse> {
  const startTime = Date.now();
  const config = getFlowiseConfig();

  if (!config) {
    return {
      success: false,
      error: "Flowise não configurado",
      method: "fallback",
      responseTime: Date.now() - startTime,
    };
  }

  // Construir URL do Flowise
  // Flowise geralmente expõe endpoints em /api/v1/prediction/{chatflowid}
  const chatflowId = process.env.FLOWISE_CHATFLOW_ID || "default";
  const flowiseUrl = `${config.baseUrl}/api/v1/prediction/${chatflowId}`;

  const prompt = buildDiagnosisPrompt(lead);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey}`;
    }

    console.log(`[Flowise] Enviando requisição para: ${flowiseUrl}`);
    console.log(`[Flowise] Lead: ${lead.email}`);

    const response = await fetch(flowiseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        question: prompt,
        inputs: {
          leadName: lead.name,
          leadEmail: lead.email,
          leadProfession: lead.profession || "",
          leadChallenge: lead.challenge || "",
          leadGroupAccepted: lead.groupAccepted,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Flowise retornou erro ${response.status}`;
      let errorDetails = "";

      try {
        const errorText = await response.text();
        console.error(`[Flowise] Erro HTTP ${response.status}:`, errorText);

        // Tentar parsear erro JSON para obter mensagem mais específica
        try {
          const errorJson = JSON.parse(errorText);

          // Extrair mensagem de erro mais específica
          if (errorJson.message) {
            errorDetails = errorJson.message;

            // Identificar erro de modelo não encontrado
            if (
              errorDetails.includes("model") &&
              errorDetails.includes("does not exist")
            ) {
              errorMessage =
                "Modelo LLM não configurado no chatflow do Flowise";
              console.error(
                "[Flowise] ⚠️  ATENÇÃO: O chatflow precisa ter um modelo LLM configurado. " +
                  "Acesse o Flowise e configure um nó LLM no seu chatflow."
              );
            } else if (errorJson.error?.message) {
              errorDetails = errorJson.error.message;
            }
          } else if (errorJson.error) {
            errorDetails = JSON.stringify(errorJson.error);
          }
        } catch {
          // Se não for JSON, usar o texto como está
          errorDetails = errorText.substring(0, 200); // Limitar tamanho
        }

        if (errorDetails) {
          errorMessage = `${errorMessage}: ${errorDetails}`;
        }
      } catch (e) {
        console.error("[Flowise] Erro ao ler resposta de erro:", e);
      }

      return {
        success: false,
        error: errorMessage,
        method: "fallback",
        responseTime: Date.now() - startTime,
      };
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    // Flowise pode retornar o diagnóstico em diferentes formatos
    // Adapte conforme a estrutura da sua resposta do Flowise
    let diagnosisText = "";

    if (data.text) {
      diagnosisText = data.text;
    } else if (data.answer) {
      diagnosisText = data.answer;
    } else if (data.response) {
      diagnosisText = data.response;
    } else if (typeof data === "string") {
      diagnosisText = data;
    } else {
      // Tentar extrair texto de qualquer campo de texto
      diagnosisText = JSON.stringify(data, null, 2);
      console.warn(
        "[Flowise] Formato de resposta não reconhecido, usando JSON completo"
      );
    }

    if (!diagnosisText || diagnosisText.trim().length === 0) {
      throw new Error("Resposta vazia do Flowise");
    }

    console.log(
      `[Flowise] Diagnóstico gerado com sucesso em ${responseTime}ms`
    );

    return {
      success: true,
      diagnosis: diagnosisText.trim(),
      method: "flowise",
      responseTime,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error.message || String(error);
    const isTimeout =
      error.name === "AbortError" || errorMessage.includes("aborted");

    if (isTimeout) {
      console.error(`[Flowise] Timeout após ${config.timeout}ms`);
    } else {
      console.error("[Flowise] Erro ao gerar diagnóstico:", errorMessage);
    }

    return {
      success: false,
      error: isTimeout ? "Timeout ao conectar com Flowise" : errorMessage,
      method: "fallback",
      responseTime,
    };
  }
}

/**
 * Testa a conexão com Flowise
 */
export async function testFlowiseConnection(): Promise<{
  connected: boolean;
  message: string;
  details?: any;
}> {
  const config = getFlowiseConfig();

  if (!config) {
    return {
      connected: false,
      message: "Flowise não configurado (FLOWISE_BASE_URL ausente)",
    };
  }

  try {
    // Tentar acessar endpoint de health ou info do Flowise
    const healthUrl =
      `${config.baseUrl}/api/v1/health` || `${config.baseUrl}/health`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const headers: Record<string, string> = {};
    if (config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(healthUrl, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      connected: response.ok,
      message: response.ok
        ? "Conexão com Flowise estabelecida com sucesso"
        : `Flowise retornou status ${response.status}`,
      details: {
        status: response.status,
        url: config.baseUrl,
      },
    };
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    return {
      connected: false,
      message: `Erro ao conectar com Flowise: ${errorMessage}`,
    };
  }
}

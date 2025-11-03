/**
 * Sistema de Analytics/Tracking
 * Suporta múltiplas ferramentas: Google Analytics 4, Plausible, e custom
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  category?: string;
  value?: number;
}

export interface AnalyticsConfig {
  enabled: boolean;
  providers: {
    ga4?: {
      measurementId?: string;
      enabled: boolean;
    };
    plausible?: {
      domain?: string;
      enabled: boolean;
    };
    custom?: {
      endpoint?: string;
      enabled: boolean;
    };
  };
}

/**
 * Obtém configuração de analytics das variáveis de ambiente
 */
function getAnalyticsConfig(): AnalyticsConfig {
  const ga4Id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const customEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;

  return {
    enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false",
    providers: {
      ga4: {
        measurementId: ga4Id,
        enabled: !!ga4Id && process.env.NEXT_PUBLIC_GA_ENABLED !== "false",
      },
      plausible: {
        domain: plausibleDomain,
        enabled: !!plausibleDomain && process.env.NEXT_PUBLIC_PLAUSIBLE_ENABLED !== "false",
      },
      custom: {
        endpoint: customEndpoint,
        enabled: !!customEndpoint && process.env.NEXT_PUBLIC_CUSTOM_ANALYTICS_ENABLED === "true",
      },
    },
  };
}

/**
 * Track event via Google Analytics 4
 */
function trackGA4(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  const config = getAnalyticsConfig();
  if (!config.providers.ga4?.enabled || !config.providers.ga4?.measurementId) {
    return;
  }

  // Verificar se gtag está disponível
  if (typeof (window as any).gtag !== "function") {
    console.warn("[Analytics] gtag não está disponível. Verifique se o script do GA4 foi carregado.");
    return;
  }

  try {
    (window as any).gtag("event", event.name, {
      event_category: event.category || "general",
      event_label: event.properties?.label,
      value: event.value,
      ...event.properties,
    });

    console.log(`[Analytics GA4] Evento: ${event.name}`, event.properties);
  } catch (error) {
    console.error("[Analytics GA4] Erro ao trackear evento:", error);
  }
}

/**
 * Track event via Plausible Analytics
 */
function trackPlausible(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  const config = getAnalyticsConfig();
  if (!config.providers.plausible?.enabled || !config.providers.plausible?.domain) {
    return;
  }

  // Verificar se plausible está disponível
  if (typeof (window as any).plausible !== "function") {
    console.warn("[Analytics] plausible não está disponível. Verifique se o script foi carregado.");
    return;
  }

  try {
    // Plausible aceita eventos customizados no formato: nome_evento + props
    const eventName = event.category ? `${event.category}_${event.name}` : event.name;
    
    (window as any).plausible(eventName, {
      props: event.properties || {},
    });

    console.log(`[Analytics Plausible] Evento: ${eventName}`, event.properties);
  } catch (error) {
    console.error("[Analytics Plausible] Erro ao trackear evento:", error);
  }
}

/**
 * Track event via endpoint customizado (server-side)
 */
async function trackCustom(event: AnalyticsEvent): Promise<void> {
  const config = getAnalyticsConfig();
  if (!config.providers.custom?.enabled || !config.providers.custom?.endpoint) {
    return;
  }

  try {
    const response = await fetch(config.providers.custom.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: event.name,
        category: event.category,
        properties: event.properties,
        value: event.value,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.warn(`[Analytics Custom] Erro HTTP ${response.status}`);
    } else {
      console.log(`[Analytics Custom] Evento enviado: ${event.name}`);
    }
  } catch (error) {
    console.error("[Analytics Custom] Erro ao enviar evento:", error);
  }
}

/**
 * Tracka um evento em todas as ferramentas de analytics configuradas
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>,
  options?: {
    category?: string;
    value?: number;
    serverSide?: boolean;
  }
): void {
  const config = getAnalyticsConfig();

  if (!config.enabled) {
    console.log("[Analytics] Analytics desabilitado");
    return;
  }

  const event: AnalyticsEvent = {
    name: eventName,
    properties,
    category: options?.category,
    value: options?.value,
  };

  // Client-side tracking
  if (!options?.serverSide && typeof window !== "undefined") {
    trackGA4(event);
    trackPlausible(event);
  }

  // Server-side tracking (custom endpoint)
  if (options?.serverSide || typeof window === "undefined") {
    trackCustom(event).catch((error) => {
      console.error("[Analytics] Erro em server-side tracking:", error);
    });
  }
}

/**
 * Tracka visualização de página
 */
export function trackPageView(path: string, title?: string): void {
  const config = getAnalyticsConfig();

  if (!config.enabled) {
    return;
  }

  // Google Analytics 4
  if (config.providers.ga4?.enabled && typeof window !== "undefined") {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("config", config.providers.ga4.measurementId, {
        page_path: path,
        page_title: title || document.title,
      });
    }
  }

  // Plausible
  if (config.providers.plausible?.enabled && typeof window !== "undefined") {
    if (typeof (window as any).plausible === "function") {
      (window as any).plausible("pageview", {
        props: {
          path,
          title: title || document.title,
        },
      });
    }
  }

  // Track como evento também
  trackEvent("page_view", {
    path,
    title: title || (typeof window !== "undefined" ? document.title : ""),
  });
}

/**
 * Eventos pré-definidos para o formulário
 */
export const FormEvents = {
  formStarted: (properties?: Record<string, any>) =>
    trackEvent("form_started", properties, { category: "form" }),

  formSubmitted: (properties?: Record<string, any>) =>
    trackEvent("form_submitted", properties, { category: "form" }),

  formError: (error: string, properties?: Record<string, any>) =>
    trackEvent("form_error", { error, ...properties }, { category: "form" }),

  formSuccess: (properties?: Record<string, any>) =>
    trackEvent("form_success", properties, { category: "form", value: 1 }),

  formFieldFocused: (fieldName: string) =>
    trackEvent("form_field_focused", { field: fieldName }, { category: "form" }),

  formFieldCompleted: (fieldName: string, value?: string) =>
    trackEvent("form_field_completed", { field: fieldName, value }, { category: "form" }),
};

/**
 * Eventos de diagnóstico
 */
export const DiagnosisEvents = {
  diagnosisGenerated: (method: string, responseTime: number) =>
    trackEvent("diagnosis_generated", { method, responseTime }, { category: "diagnosis" }),

  diagnosisCached: () =>
    trackEvent("diagnosis_cached", {}, { category: "diagnosis" }),

  flowiseUsed: (success: boolean, responseTime?: number) =>
    trackEvent("flowise_used", { success, responseTime }, { category: "diagnosis" }),
};

/**
 * Eventos de email
 */
export const EmailEvents = {
  emailSent: (success: boolean, error?: string) =>
    trackEvent("email_sent", { success, error }, { category: "email" }),

  emailOpened: (leadId?: string) =>
    trackEvent("email_opened", { leadId }, { category: "email" }),
};

/**
 * Eventos de webhook
 */
export const WebhookEvents = {
  webhookSent: (service: string, success: boolean, error?: string) =>
    trackEvent("webhook_sent", { service, success, error }, { category: "webhook" }),
};

/**
 * Verifica se analytics está configurado e habilitado
 */
export function isAnalyticsEnabled(): boolean {
  const config = getAnalyticsConfig();
  return !!(
    config.enabled && (
      config.providers.ga4?.enabled ||
      config.providers.plausible?.enabled ||
      config.providers.custom?.enabled
    )
  );
}

/**
 * Retorna informações sobre configuração (para debug)
 */
export function getAnalyticsInfo(): {
  enabled: boolean;
  providers: string[];
  config: AnalyticsConfig;
} {
  const config = getAnalyticsConfig();
  const providers: string[] = [];

  if (config.providers.ga4?.enabled) providers.push("GA4");
  if (config.providers.plausible?.enabled) providers.push("Plausible");
  if (config.providers.custom?.enabled) providers.push("Custom");

  return {
    enabled: config.enabled,
    providers,
    config,
  };
}


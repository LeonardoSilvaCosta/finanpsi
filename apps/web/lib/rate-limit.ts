/**
 * Rate Limiting simples em memória
 * Para produção, considere usar Redis ou @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Cache em memória (limpar periodicamente)
const rateLimitCache = new Map<string, RateLimitEntry>();

// Limpar entradas expiradas a cada 5 minutos
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitCache.entries()) {
      if (now > entry.resetTime) {
        rateLimitCache.delete(key);
      }
    }
  }, 5 * 60 * 1000); // 5 minutos
}

/**
 * Verifica se uma requisição excedeu o rate limit
 * @param identifier Identificador único (IP, email, etc.)
 * @param maxRequests Número máximo de requisições
 * @param windowMs Janela de tempo em milissegundos
 * @returns true se permitido, false se bloqueado
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutos padrão
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitCache.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Nova entrada ou expirada
    rateLimitCache.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (entry.count >= maxRequests) {
    // Rate limit excedido
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Incrementar contador
  entry.count++;
  rateLimitCache.set(identifier, entry);

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Obtém IP do cliente da requisição
 */
export function getClientIP(req: Request): string {
  // Tentar obter IP de vários headers comuns
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback
  return "unknown";
}

/**
 * Middleware de rate limiting para API routes
 */
export function rateLimitMiddleware(
  req: Request,
  options: {
    maxRequests?: number;
    windowMs?: number;
    identifier?: string;
  } = {}
): { allowed: boolean; remaining: number; resetTime: number } | null {
  const {
    maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 5),
    windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    identifier,
  } = options;

  // Usar identificador fornecido ou IP do cliente
  const id = identifier || getClientIP(req);

  // Verificar rate limit
  return checkRateLimit(id, maxRequests, windowMs);
}


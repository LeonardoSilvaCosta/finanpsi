import type { LeadData } from './diagnosis'

export interface CachedDiagnosis {
  diagnosis: string
  method: 'flowise' | 'rules' | 'hybrid'
  timestamp: number
  leadHash: string
}

/**
 * Cache simples em memória (em produção, considere usar Redis)
 * Chave: hash dos dados do lead (email + challenge + profession)
 */
class DiagnosisCache {
  private cache: Map<string, CachedDiagnosis>
  private maxAge: number // TTL em milissegundos
  private maxSize: number // Máximo de entradas no cache

  constructor(maxAgeMs = 24 * 60 * 60 * 1000, maxSize = 1000) {
    this.cache = new Map()
    this.maxAge = maxAgeMs // 24 horas padrão
    this.maxSize = maxSize
  }

  /**
   * Gera hash simples dos dados do lead para usar como chave do cache
   */
  private generateLeadHash(lead: LeadData): string {
    const key = `${lead.email}:${lead.challenge || ''}:${lead.profession || ''}:${lead.groupAccepted}`
    // Hash simples (em produção, use algo mais robusto como crypto.createHash)
    return Buffer.from(key).toString('base64').substring(0, 50)
  }

  /**
   * Verifica se existe diagnóstico em cache válido para o lead
   */
  get(lead: LeadData): CachedDiagnosis | null {
    const hash = this.generateLeadHash(lead)
    const cached = this.cache.get(hash)

    if (!cached) {
      return null
    }

    // Verificar se está expirado
    const age = Date.now() - cached.timestamp
    if (age > this.maxAge) {
      this.cache.delete(hash)
      return null
    }

    console.log(`[Cache] Diagnóstico encontrado em cache (idade: ${Math.round(age / 1000)}s)`)
    return cached
  }

  /**
   * Armazena diagnóstico no cache
   */
  set(lead: LeadData, diagnosis: string, method: 'flowise' | 'rules' | 'hybrid'): void {
    const hash = this.generateLeadHash(lead)

    // Se cache está cheio, remover entrada mais antiga
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0]
      this.cache.delete(oldestKey)
    }

    this.cache.set(hash, {
      diagnosis,
      method,
      timestamp: Date.now(),
      leadHash: hash,
    })

    console.log(`[Cache] Diagnóstico armazenado em cache (método: ${method})`)
  }

  /**
   * Limpa todas as entradas expiradas
   */
  cleanExpired(): number {
    const now = Date.now()
    let cleaned = 0

    for (const [hash, entry] of this.cache.entries()) {
      const age = now - entry.timestamp
      if (age > this.maxAge) {
        this.cache.delete(hash)
        cleaned++
      }
    }

    if (cleaned > 0) {
      console.log(`[Cache] ${cleaned} entradas expiradas removidas`)
    }

    return cleaned
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear()
    console.log('[Cache] Cache limpo completamente')
  }

  /**
   * Retorna estatísticas do cache
   */
  getStats() {
    const now = Date.now()
    let valid = 0
    let expired = 0

    for (const entry of this.cache.values()) {
      const age = now - entry.timestamp
      if (age > this.maxAge) {
        expired++
      } else {
        valid++
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      maxSize: this.maxSize,
      maxAgeMs: this.maxAge,
    }
  }
}

// Instância singleton do cache
const diagnosisCache = new DiagnosisCache(
  Number(process.env.DIAGNOSIS_CACHE_MAX_AGE_MS || 24 * 60 * 60 * 1000), // 24h padrão
  Number(process.env.DIAGNOSIS_CACHE_MAX_SIZE || 1000)
)

// Limpar cache expirado periodicamente (a cada hora)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    diagnosisCache.cleanExpired()
  }, 60 * 60 * 1000) // 1 hora
}

export default diagnosisCache


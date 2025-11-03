# Sistema de Diagnóstico Financeiro

## Visão Geral

O sistema de diagnóstico financeiro do FinanPsi foi implementado com arquitetura híbrida, combinando regras baseadas em padrões e inteligência artificial via Flowise.

## Arquitetura

### Componentes

1. **`apps/web/lib/diagnosis.ts`** - Lógica principal de diagnóstico
   - `generateDiagnosis()` - Geração baseada em regras
   - `generateDiagnosisAdvanced()` - Sistema híbrido (recomendado)
   - `analyzeChallenge()` - Análise e categorização de desafios

2. **`apps/web/lib/flowise.ts`** - Integração com Flowise
   - `generateDiagnosisWithFlowise()` - Geração via IA
   - `testFlowiseConnection()` - Teste de conectividade

3. **`apps/web/lib/diagnosis-cache.ts`** - Sistema de cache
   - Cache em memória com TTL configurável
   - Limpeza automática de entradas expiradas

## Categorias de Diagnóstico

O sistema identifica automaticamente 10 categorias de desafios financeiros:

1. **Dívidas** - Gerenciamento de endividamento
2. **Poupança** - Dificuldade em economizar
3. **Planejamento** - Falta de organização financeira
4. **Investimento** - Interesse em investir
5. **Ansiedade** - Ansiedade financeira
6. **Renda Variável** - Gerenciamento de renda instável
7. **Emergência** - Necessidade de reserva de emergência
8. **Aposentadoria** - Planejamento para aposentadoria
9. **Educação Financeira** - Necessidade de conhecimento
10. **Relacionamento Dinheiro** - Aspecto emocional

## Sistema Híbrido

O sistema funciona em cascata:

```
1. Verificar Cache
   ↓ (se não encontrado)
2. Tentar Flowise (IA)
   ↓ (se falhar ou não configurado)
3. Usar Regras (Fallback)
```

### Vantagens

- **Performance**: Cache reduz latência significativamente
- **Confiabilidade**: Fallback para regras garante sempre uma resposta
- **Flexibilidade**: Pode usar IA quando disponível, regras quando necessário
- **Custo**: Reduz chamadas ao LLM através de cache

## Configuração

### Variáveis de Ambiente

```bash
# Ativar diagnóstico via Flowise (IA)
DIAGNOSIS_PREFER_FLOWISE=true

# Configuração do Flowise
FLOWISE_BASE_URL=http://flowise:3000
FLOWISE_API_KEY=opcional
FLOWISE_CHATFLOW_ID=default
FLOWISE_TIMEOUT=30000

# Cache
DIAGNOSIS_USE_CACHE=true
DIAGNOSIS_CACHE_MAX_AGE_MS=86400000  # 24 horas
DIAGNOSIS_CACHE_MAX_SIZE=1000
```

### Modos de Operação

1. **Apenas Regras** (padrão)
   ```bash
   DIAGNOSIS_PREFER_FLOWISE=false
   ```

2. **Híbrido com Fallback**
   ```bash
   DIAGNOSIS_PREFER_FLOWISE=true
   ```

3. **Apenas IA** (sem fallback)
   - Não recomendado em produção
   - Requer configuração customizada no código

## Uso na API

### Endpoint: `/api/register`

O diagnóstico é gerado automaticamente ao registrar um lead:

```typescript
const diagnosisResult = await generateDiagnosisAdvanced(lead, {
  useCache: true,
  preferFlowise: process.env.DIAGNOSIS_PREFER_FLOWISE === "true",
  fallbackToRules: true,
});

// Resultado inclui:
// - diagnosis: string (texto do diagnóstico)
// - method: 'flowise' | 'rules' | 'hybrid' | 'cache'
// - responseTime: number (ms)
// - cached?: boolean
// - flowiseAttempted?: boolean
// - flowiseSuccess?: boolean
```

### Resposta da API

```json
{
  "ok": true,
  "emailSent": true,
  "webhookSent": true,
  "diagnosis": {
    "generated": true,
    "method": "hybrid",
    "responseTime": 1250
  }
}
```

## Logs e Monitoramento

O sistema gera logs detalhados:

```
[Diagnóstico] Gerado com sucesso para lead abc123
[Diagnóstico] Método: hybrid, Tempo: 1250ms
[Diagnóstico] Flowise tentado: Sucesso
[Cache] Diagnóstico encontrado em cache (idade: 3600s)
```

### Métricas Importantes

- **Tempo de Resposta**: `responseTime` em milissegundos
- **Taxa de Cache Hit**: Monitorar logs `[Cache] Diagnóstico encontrado`
- **Taxa de Sucesso Flowise**: Monitorar `Flowise tentado: Sucesso/Falhou`

## Melhorias Implementadas

### Fase 1: ✅ Expandir Regras
- Adicionadas 5 novas categorias (total: 10)
- Sistema de pontuação para categorização
- Categorias alternativas identificadas

### Fase 2: ✅ Integração Flowise
- Cliente Flowise completo
- Tratamento de erros e timeouts
- Teste de conectividade

### Fase 3: ✅ Sistema Híbrido
- Função `generateDiagnosisAdvanced()`
- Fallback automático
- Logs detalhados

### Fase 4: ✅ Otimizações
- Cache em memória
- Limpeza automática
- Configuração flexível

## Próximos Passos Sugeridos

1. **Métricas e Analytics**
   - Dashboard de métricas de diagnóstico
   - Taxa de uso por categoria
   - Performance comparativa (IA vs Regras)

2. **Cache Persistente**
   - Migrar de cache em memória para Redis
   - Melhorar TTL e estratégias de invalidação

3. **Melhorias no Flowise**
   - Otimizar prompts
   - Adicionar contexto de histórico
   - Fine-tuning do modelo

4. **A/B Testing**
   - Comparar diagnósticos IA vs Regras
   - Medir conversão e satisfação

## Troubleshooting

### Flowise não conecta
- Verificar `FLOWISE_BASE_URL`
- Testar com `testFlowiseConnection()`
- Verificar logs do container Flowise

### Cache não funciona
- Verificar `DIAGNOSIS_USE_CACHE`
- Limpar cache manualmente se necessário
- Verificar tamanho do cache

### Diagnóstico sempre usa regras
- Verificar `DIAGNOSIS_PREFER_FLOWISE=true`
- Verificar se Flowise está acessível
- Ver logs para erros específicos


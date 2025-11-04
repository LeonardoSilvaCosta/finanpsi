# Quick Start - Diagnóstico Instantâneo 🚀

## O Que É?

Uma funcionalidade que mostra uma **prévia instantânea** do diagnóstico financeiro/emocional para o usuário **antes mesmo de completar o cadastro**.

## Por Que Isso Importa?

- 📈 **Aumenta conversão**: Usuários veem valor antes de se comprometerem
- 🎯 **Reduz atrito**: Demonstra qualidade sem pedir e-mail primeiro
- ⚡ **Engajamento imediato**: Resposta em menos de 1 segundo
- 💡 **Validação rápida**: Usuário confirma que o serviço é relevante

## Como Funciona?

```
1. Usuário preenche campo "desafio" (10+ caracteres)
   ↓
2. Botão "Ver Prévia do Diagnóstico" aparece automaticamente
   ↓
3. Usuário clica → Análise instantânea
   ↓
4. Prévia aparece com:
   - Categoria identificada
   - Mensagem personalizada
   - Próximos passos
   - CTA para cadastro completo
```

## Setup Rápido (5 minutos)

### 1. Verificar Arquivos Criados

✅ `apps/web/app/api/instant-diagnosis/route.ts` - API endpoint
✅ `apps/web/components/Form.tsx` - UI atualizada
✅ `apps/web/styles/globals.css` - Animações

### 2. Variáveis de Ambiente (Opcional)

```bash
# .env.local ou .env

# Rate limit (opcional - padrão: 10)
INSTANT_DIAGNOSIS_RATE_LIMIT=10

# Flowise para IA (opcional - usa regras se não configurado)
FLOWISE_BASE_URL=http://localhost:3000
FLOWISE_CHATFLOW_ID=seu-chatflow-id
FLOWISE_API_KEY=sua-chave-api
```

> **Nota**: Funciona sem configuração! Flowise é opcional.

### 3. Testar Localmente

```bash
# Iniciar o servidor
npm run dev

# Acessar
http://localhost:3000

# Testar
1. Preencher nome e email
2. Avançar para passo 2
3. Escrever desafio com 10+ caracteres
4. Clicar em "Ver Prévia do Diagnóstico"
5. ✨ Magia acontece!
```

## Exemplos de Teste

### Teste 1: Dívidas
```
Desafio: "Tenho muitas dívidas no cartão de crédito e não consigo pagar"
Resultado esperado: Categoria "dívidas"
```

### Teste 2: Ansiedade
```
Desafio: "Fico muito ansioso quando penso em dinheiro e no futuro"
Resultado esperado: Categoria "ansiedade"
```

### Teste 3: Poupança
```
Desafio: "Não consigo guardar dinheiro, gasto tudo que ganho"
Resultado esperado: Categoria "poupança"
```

### Teste 4: Investimento
```
Desafio: "Quero começar a investir mas não sei por onde começar"
Resultado esperado: Categoria "investimento"
```

## API Usage

### Request
```bash
curl -X POST http://localhost:3000/api/instant-diagnosis \
  -H "Content-Type: application/json" \
  -d '{
    "challenge": "Tenho muitas dívidas e não sei o que fazer",
    "profession": "Psicóloga",
    "name": "Maria",
    "type": "basic"
  }'
```

### Response
```json
{
  "success": true,
  "diagnosis": {
    "preview": true,
    "category": "dívidas",
    "confidence": 0.89,
    "summary": "Priorize o gerenciamento de dívidas...",
    "keywords": ["dívidas", "cartão", "pagar"],
    "message": "Identificamos que seu principal desafio...",
    "nextSteps": [
      "Complete seu cadastro para receber o diagnóstico completo",
      "Participe da comunidade FinanPsi para suporte contínuo",
      "Receba dicas práticas e acionáveis por e-mail"
    ]
  },
  "method": "rules",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Categorias Detectadas

| Categoria | Keywords Exemplo | Resumo |
|-----------|------------------|--------|
| 🔴 dívidas | dívida, devedor, pagar | Gestão de dívidas |
| 💰 poupança | poupar, guardar, economizar | Hábitos de economia |
| 📋 planejamento | organizar, planejar, controlar | Planejamento financeiro |
| 📈 investimento | investir, aplicar, render | Estratégias de investimento |
| 😰 ansiedade | ansioso, preocupado, medo | Aspectos emocionais |
| 💸 renda_variável | variável, irregular, instável | Renda irregular |
| 🆘 emergência | emergência, imprevisto, reserva | Reserva de emergência |
| 👴 aposentadoria | aposentadoria, futuro, previdência | Planejamento aposentadoria |
| 📚 educação_financeira | aprender, conhecimento, entender | Educação financeira |
| 💔 relacionamento_dinheiro | relação, sentimento, emocional | Relação com dinheiro |

## Troubleshooting

### Problema: Botão não aparece
**Solução**: Desafio precisa ter pelo menos 10 caracteres

### Problema: Loading infinito
**Solução**: 
1. Verificar console do navegador
2. Verificar logs do servidor
3. Verificar rate limit (headers da resposta)

### Problema: Erro 429 (Too Many Requests)
**Solução**: 
- Aguardar tempo especificado no header `Retry-After`
- Aumentar `INSTANT_DIAGNOSIS_RATE_LIMIT` no .env

### Problema: Prévia não aparece
**Solução**:
1. Abrir DevTools → Network
2. Verificar resposta de `/api/instant-diagnosis`
3. Verificar console para erros JavaScript

## Logs Úteis

```bash
# Filtrar logs de diagnóstico instantâneo
grep "Instant Diagnosis" logs/app.log

# Exemplos de logs
[Instant Diagnosis] Diagnóstico solicitado
[Instant Diagnosis] Diagnóstico gerado com regras
[Instant Diagnosis] Diagnóstico gerado com Flowise
[Instant Diagnosis Rate Limit] Requisição bloqueada
```

## Performance

| Métrica | Valor | Nota |
|---------|-------|------|
| Tempo de resposta (basic) | < 1s | Regras locais |
| Tempo de resposta (full) | 3-10s | Com Flowise/IA |
| Rate limit padrão | 10 req/15min | Configurável |
| Tamanho da resposta | ~2KB | JSON compacto |

## Checklist de Deploy

- [ ] Testar localmente em todos os passos do formulário
- [ ] Verificar responsividade mobile
- [ ] Testar com diferentes desafios (cada categoria)
- [ ] Verificar rate limiting
- [ ] Confirmar animações funcionando
- [ ] Testar com Flowise desligado (fallback)
- [ ] Verificar logs e erros
- [ ] Configurar variáveis de ambiente em produção
- [ ] Monitorar métricas pós-deploy

## Métricas para Monitorar

```javascript
// Taxa de uso
instant_diagnosis_rate = diagnoses_requested / step_2_views

// Taxa de conversão
conversion_after_diagnosis = completed_forms / diagnoses_shown

// Tempo médio
avg_time_to_diagnosis = avg(diagnosis_shown_time - button_click_time)

// Categorias mais comuns
top_categories = group_by(diagnoses, 'category').sort_by('count')
```

## Próximos Passos

1. ✅ **Deploy** - Colocar em produção
2. 📊 **Analytics** - Adicionar tracking de eventos
3. 🧪 **A/B Test** - Testar diferentes CTAs
4. 💬 **Feedback** - Coletar opinião dos usuários
5. 🎨 **Otimizar** - Melhorar baseado em dados

## Recursos Adicionais

- 📖 [Documentação Completa](./INSTANT_DIAGNOSIS.md)
- 📋 [Resumo da Implementação](./INSTANT_DIAGNOSIS_SUMMARY.md)
- 🔧 [Documentação de Diagnóstico](./DIAGNOSIS.md)
- 🤖 [Setup do Flowise](./FLOWISE_SETUP.md)

## Suporte

**Problemas?** Verifique:
1. Console do navegador (F12)
2. Logs do servidor
3. Network tab (DevTools)
4. Rate limit headers

**Dúvidas?** Consulte a [documentação completa](./INSTANT_DIAGNOSIS.md)

---

**Status**: ✅ Pronto para usar
**Tempo de setup**: ~5 minutos
**Dificuldade**: ⭐ Fácil
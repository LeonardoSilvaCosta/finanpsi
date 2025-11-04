# Diagnóstico Instantâneo - FinanPsi

## 📋 Visão Geral

O **Diagnóstico Instantâneo** é uma funcionalidade que permite aos usuários receberem uma prévia do diagnóstico financeiro/emocional imediatamente após preencherem o campo de desafio no formulário, **antes mesmo de completarem o cadastro**.

Esta funcionalidade aumenta significativamente o engajamento e a taxa de conversão ao demonstrar valor instantâneo para o usuário.

## 🎯 Objetivos

- **Aumentar a retenção**: Usuários veem valor imediato antes de completar o cadastro
- **Reduzir fricção**: Demonstra a qualidade do diagnóstico sem exigir compromisso total
- **Melhorar conversão**: Incentiva usuários a completarem o cadastro para receber a análise completa
- **Validar interesse**: Usuários veem se o serviço realmente atende suas necessidades

## 🏗️ Arquitetura

### Componentes Criados/Modificados

1. **API Endpoint**: `/api/instant-diagnosis`
   - Localização: `apps/web/app/api/instant-diagnosis/route.ts`
   - Aceita requisições POST com o desafio do usuário
   - Retorna diagnóstico básico ou completo

2. **Componente Form.tsx**
   - Localização: `apps/web/components/Form.tsx`
   - Adicionados estados para diagnóstico instantâneo
   - Novo botão "Ver Prévia do Diagnóstico"
   - UI para exibir a prévia do diagnóstico

3. **Estilos Globais**
   - Localização: `apps/web/styles/globals.css`
   - Adicionada animação `fadeIn` para o diagnóstico

## 🔄 Fluxo de Funcionamento

### 1. Usuário preenche o desafio
```
Usuário no Passo 2 do formulário
↓
Escreve pelo menos 10 caracteres no campo "desafio"
↓
Botão "Ver Prévia do Diagnóstico" aparece
```

### 2. Solicitação de diagnóstico instantâneo
```
Clique no botão
↓
Loading state ativado
↓
Requisição POST para /api/instant-diagnosis
  - challenge: texto do desafio
  - profession: profissão (opcional)
  - name: nome (opcional)
  - type: "basic"
```

### 3. Processamento no backend
```
Validação dos dados
↓
Análise do desafio usando analyzeChallenge()
↓
Geração de resumo usando generateDiagnosisSummary()
↓
Retorno de JSON estruturado
```

### 4. Exibição da prévia
```
Animação fadeIn
↓
Exibição da categoria identificada
↓
Mensagem personalizada
↓
Lista de próximos passos
↓
CTA para completar cadastro
```

## 📊 Tipos de Diagnóstico

### Basic (Instantâneo)
- **Velocidade**: < 1 segundo
- **Método**: Regras baseadas em keywords
- **Conteúdo**:
  - Categoria do desafio
  - Nível de confiança
  - Resumo curto
  - Keywords identificadas
  - Próximos passos sugeridos

### Full (Completo)
- **Velocidade**: 3-10 segundos
- **Método**: IA (Flowise) com fallback para regras
- **Conteúdo**:
  - Análise completa e personalizada
  - Plano de ação detalhado
  - Insights específicos
  - Recomendações práticas

## 🎨 Interface do Usuário

### Componentes Visuais

1. **Card de CTA para Diagnóstico**
   - Background: `#FFF8F5`
   - Border: `#A8D5BA`
   - Ícone de raio (lightning) verde
   - Título: "🎯 Veja sua prévia de diagnóstico agora!"
   - Descrição explicativa
   - Botão com loading state

2. **Card de Prévia do Diagnóstico**
   - Animação fadeIn ao aparecer
   - Ícone de lâmpada (💡)
   - Categoria destacada em verde
   - Mensagem personalizada
   - Lista de próximos passos
   - CTA para completar cadastro

### Estados do Botão

- **Idle**: "✨ Ver Prévia do Diagnóstico"
- **Loading**: "Analisando..." (com spinner animado)
- **Disabled**: Opacidade 50%, cursor not-allowed

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# Rate limiting para diagnóstico instantâneo (mais permissivo que registro)
INSTANT_DIAGNOSIS_RATE_LIMIT=10

# Rate limiting geral
RATE_LIMIT_WINDOW_MS=900000  # 15 minutos

# Flowise (opcional, para diagnóstico completo com IA)
FLOWISE_BASE_URL=http://localhost:3000
FLOWISE_CHATFLOW_ID=seu-chatflow-id
FLOWISE_API_KEY=sua-api-key
```

### Rate Limiting

- **Diagnóstico Instantâneo**: 10 requisições / 15 minutos
- **Registro Completo**: 5 requisições / 15 minutos

O rate limit mais permissivo permite que usuários experimentem o diagnóstico instantâneo múltiplas vezes enquanto refinam seu desafio.

## 📡 API Specification

### POST `/api/instant-diagnosis`

#### Request Body
```json
{
  "challenge": "string (min 10 caracteres)",
  "profession": "string (opcional)",
  "name": "string (opcional)",
  "type": "basic" | "full"
}
```

#### Response (type: "basic")
```json
{
  "success": true,
  "diagnosis": {
    "preview": true,
    "category": "dívidas" | "poupança" | "planejamento" | ...,
    "confidence": 0.85,
    "summary": "Mensagem resumida...",
    "keywords": ["palavra1", "palavra2"],
    "message": "Mensagem personalizada completa",
    "nextSteps": [
      "Passo 1",
      "Passo 2",
      "Passo 3"
    ]
  },
  "method": "rules",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Response (type: "full")
```json
{
  "success": true,
  "diagnosis": {
    "preview": false,
    "category": "ansiedade",
    "confidence": 0.92,
    "fullText": "Diagnóstico completo e personalizado...",
    "keywords": ["ansiedade", "dinheiro", "futuro"]
  },
  "method": "flowise" | "rules",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Error Response
```json
{
  "error": "Mensagem de erro",
  "message": "Detalhes do erro"
}
```

## 🎯 Categorias de Diagnóstico

1. **dívidas**: Gestão e renegociação de dívidas
2. **poupança**: Desenvolvimento de hábitos de poupança
3. **planejamento**: Planejamento financeiro para renda variável
4. **investimento**: Preparação para investimentos
5. **ansiedade**: Gestão emocional relacionada a dinheiro
6. **renda_variável**: Estratégias para renda variável
7. **emergência**: Criação de reserva de emergência
8. **aposentadoria**: Planejamento de aposentadoria
9. **educação_financeira**: Desenvolvimento de conhecimento financeiro
10. **relacionamento_dinheiro**: Aspectos emocionais da relação com dinheiro
11. **geral**: Estratégia financeira geral

## 📈 Métricas e Analytics

### Eventos Trackados

```typescript
// Quando usuário clica no botão de diagnóstico instantâneo
FormEvents.instantDiagnosisRequested({
  profession: string,
  challengeLength: number,
  challengeCategory: string
})

// Quando o diagnóstico é exibido com sucesso
FormEvents.instantDiagnosisShown({
  category: string,
  confidence: number,
  method: 'basic' | 'full',
  responseTime: number
})

// Quando usuário completa cadastro após ver diagnóstico
FormEvents.formSubmittedAfterDiagnosis({
  diagnosisCategory: string,
  timeFromDiagnosis: number
})
```

## 🔒 Segurança

### Rate Limiting
- Proteção contra abuso da API
- Headers de rate limit incluídos na resposta
- Retry-After header quando limite excedido

### Validação de Input
- Desafio deve ter pelo menos 10 caracteres
- Sanitização de entrada para prevenir XSS
- Validação de tipo de diagnóstico

### Rate Limit Headers
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1642243200
Retry-After: 900
```

## 🚀 Melhorias Futuras

### Curto Prazo
- [ ] Adicionar analytics específicos para diagnóstico instantâneo
- [ ] A/B testing de diferentes mensagens de CTA
- [ ] Otimização de keywords para melhor categorização
- [ ] Cache de diagnósticos similares

### Médio Prazo
- [ ] Integração com sistema de recomendação de conteúdo
- [ ] Personalização baseada em histórico de usuário
- [ ] Suporte a múltiplos idiomas
- [ ] Diagnóstico em tempo real (streaming)

### Longo Prazo
- [ ] Modelo de ML próprio para categorização
- [ ] Diagnóstico multimodal (texto + áudio + vídeo)
- [ ] Sistema de follow-up automático
- [ ] Dashboard de insights agregados

## 🧪 Testes

### Testes de Unidade
```bash
# Testar análise de desafios
npm test -- diagnosis.test.ts

# Testar API endpoint
npm test -- instant-diagnosis.route.test.ts
```

### Testes de Integração
```bash
# Testar fluxo completo
npm test -- form-instant-diagnosis.test.ts
```

### Testes Manuais
1. Preencher formulário até o passo 2
2. Escrever desafio com menos de 10 caracteres → botão não aparece
3. Escrever desafio com 10+ caracteres → botão aparece
4. Clicar no botão → loading state
5. Verificar exibição da prévia
6. Verificar animação fadeIn
7. Verificar responsividade mobile

## 📞 Suporte

Para questões sobre o Diagnóstico Instantâneo:
- Verificar logs: `[Instant Diagnosis]` prefix
- Rate limit issues: Aumentar `INSTANT_DIAGNOSIS_RATE_LIMIT`
- Flowise issues: Verificar `FLOWISE_BASE_URL` e conectividade

## 🔗 Links Relacionados

- [Documentação de Diagnóstico](./DIAGNOSIS.md)
- [Documentação de Flowise](./FLOWISE_SETUP.md)
- [Documentação de Analytics](./ANALYTICS.md)
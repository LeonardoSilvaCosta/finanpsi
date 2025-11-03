# Sistema de Analytics/Tracking

## Visão Geral

Sistema de tracking implementado com suporte para múltiplas ferramentas de analytics:
- **Google Analytics 4 (GA4)**
- **Plausible Analytics**
- **Custom Endpoint** (para integrações próprias)

## Configuração

### Variáveis de Ambiente

Adicione ao seu `.env`:

```bash
# Habilitar/Desabilitar Analytics (padrão: true)
NEXT_PUBLIC_ANALYTICS_ENABLED=true

# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_ENABLED=true  # Opcional, padrão: true se GA_MEASUREMENT_ID estiver configurado

# Plausible Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=seu-dominio.com
NEXT_PUBLIC_PLAUSIBLE_ENABLED=true  # Opcional, padrão: true se PLAUSIBLE_DOMAIN estiver configurado

# Custom Analytics Endpoint
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://seu-endpoint.com/api/analytics
NEXT_PUBLIC_CUSTOM_ANALYTICS_ENABLED=true  # Opcional, precisa ser explicitamente true
```

### Configuração Mínima

Para habilitar analytics, você precisa configurar pelo menos uma das ferramentas:

**Opção 1: Apenas Google Analytics 4**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Opção 2: Apenas Plausible**
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=seu-dominio.com
```

**Opção 3: Múltiplas ferramentas**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=seu-dominio.com
```

## Eventos Trackeados

### Eventos do Formulário

| Evento | Quando é disparado | Propriedades |
|--------|---------------------|--------------|
| `form_started` | Usuário começa a preencher o formulário | - |
| `form_submitted` | Formulário é submetido | `profession`, `challengeCategory`, `challengeKeywords`, `groupAccepted`, `challengeConfidence` |
| `form_success` | Formulário enviado com sucesso | `emailSent`, `webhookSent`, `diagnosisMethod`, `diagnosisResponseTime` |
| `form_error` | Erro ao enviar formulário | `error`, `status`, `profession`, `challengeCategory` |
| `form_field_focused` | Campo recebe foco | `field` |
| `form_field_completed` | Campo é preenchido | `field`, `value` |

### Eventos de Diagnóstico

| Evento | Quando é disparado | Propriedades |
|--------|---------------------|--------------|
| `diagnosis_generated` | Diagnóstico é gerado | `method`, `responseTime` |
| `diagnosis_cached` | Diagnóstico servido do cache | - |
| `flowise_used` | Flowise é usado (sucesso ou falha) | `success`, `responseTime` |

### Eventos de Email

| Evento | Quando é disparado | Propriedades |
|--------|---------------------|--------------|
| `email_sent` | Email é enviado (sucesso ou falha) | `success`, `error` |
| `email_opened` | Email é aberto | `leadId` |

### Eventos de Webhook

| Evento | Quando é disparado | Propriedades |
|--------|---------------------|--------------|
| `webhook_sent` | Webhook é enviado (sucesso ou falha) | `service`, `success`, `error` |

### Eventos de Navegação

| Evento | Quando é disparado | Propriedades |
|--------|---------------------|--------------|
| `page_view` | Página é visualizada | `path`, `title` |

## Uso no Código

### Client-Side

```typescript
import { trackEvent, FormEvents, trackPageView } from '@/lib/analytics'

// Track evento customizado
trackEvent('custom_event', { property: 'value' }, { category: 'custom' })

// Track eventos do formulário
FormEvents.formStarted()
FormEvents.formSubmitted({ profession: 'Psicólogo' })
FormEvents.formSuccess({ emailSent: true })

// Track page view
useEffect(() => {
  trackPageView(window.location.pathname, document.title)
}, [])
```

### Server-Side

```typescript
import { DiagnosisEvents, EmailEvents, WebhookEvents } from '@/lib/analytics'

// Track diagnóstico
DiagnosisEvents.diagnosisGenerated('flowise', 1250)

// Track email
EmailEvents.emailSent(true)

// Track webhook
WebhookEvents.webhookSent('n8n', true)
```

### Endpoint de Analytics

Para enviar eventos server-side via endpoint:

```bash
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "event": "custom_event",
    "category": "custom",
    "properties": { "key": "value" },
    "value": 100
  }'
```

Verificar status do analytics:

```bash
curl http://localhost:3000/api/analytics
```

## Verificando se Analytics está Funcionando

### 1. Verificar Configuração

```bash
# Verificar variáveis de ambiente no container
docker compose exec web printenv | grep -E "(ANALYTICS|GA|PLAUSIBLE)"
```

### 2. Verificar no Console do Navegador

Abra o DevTools (F12) e verifique:
- **Console**: Logs `[Analytics GA4]` ou `[Analytics Plausible]`
- **Network**: Requisições para `google-analytics.com` ou `plausible.io`

### 3. Verificar no Dashboard

- **Google Analytics**: Acesse [analytics.google.com](https://analytics.google.com) e veja eventos em tempo real
- **Plausible**: Acesse seu dashboard do Plausible e veja eventos

### 4. Testar Endpoint

```bash
# Verificar status
curl http://localhost:3000/api/analytics

# Enviar evento de teste
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"event": "test_event", "properties": {"test": true}}'
```

## Estrutura de Arquivos

```
apps/web/
├── lib/
│   └── analytics.ts          # Sistema principal de analytics
├── components/
│   ├── Analytics.tsx          # Componente que carrega scripts
│   └── Form.tsx              # Formulário com tracking
├── app/
│   ├── api/
│   │   └── analytics/
│   │       └── route.ts       # Endpoint server-side
│   ├── layout.tsx            # Layout com componente Analytics
│   └── page.tsx               # Página com tracking de page view
```

## Troubleshooting

### Analytics não está funcionando

1. **Verificar variáveis de ambiente:**
   ```bash
   docker compose exec web printenv | grep ANALYTICS
   ```

2. **Verificar se scripts estão carregando:**
   - Abra DevTools → Network
   - Procure por requisições para `googletagmanager.com` ou `plausible.io`

3. **Verificar console do navegador:**
   - Procure por logs `[Analytics]`
   - Verifique erros de JavaScript

### Eventos não aparecem no dashboard

1. **Google Analytics:**
   - Verifique se o `GA_MEASUREMENT_ID` está correto
   - Aguarde alguns minutos (GA4 pode ter delay)
   - Verifique se está na view "Realtime" no GA4

2. **Plausible:**
   - Verifique se o `PLAUSIBLE_DOMAIN` está correto
   - Aguarde alguns minutos
   - Verifique se o domínio está configurado no Plausible

### Analytics está desabilitado

Se `NEXT_PUBLIC_ANALYTICS_ENABLED=false`, todos os eventos serão ignorados. Verifique no `.env`:

```bash
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

## Próximos Passos

1. **Dashboard de Métricas:**
   - Criar dashboard interno com métricas agregadas
   - Integrar com ferramentas de BI

2. **A/B Testing:**
   - Usar eventos para testar variações
   - Medir conversão

3. **Funil de Conversão:**
   - Mapear jornada do usuário
   - Identificar pontos de abandono

4. **Alertas:**
   - Configurar alertas para eventos críticos
   - Monitorar taxa de erro


# 📚 Documentação do Componente FAQ Interativo

> Sistema de perguntas frequentes com accordion, busca e filtros por categoria para melhorar a experiência do usuário e reduzir objeções de conversão.

[![Componente](https://img.shields.io/badge/Componente-FAQ-blue)](https://github.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Accordion-purple)](https://ui.shadcn.com)
[![Status](https://img.shields.io/badge/Status-Produção-success)](https://github.com)

---

## 📑 Índice

- [Visão Geral](#visão-geral)
- [Recursos Principais](#recursos-principais)
- [Instalação](#instalação)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Uso Básico](#uso-básico)
- [Perguntas e Respostas](#perguntas-e-respostas)
- [Categorias](#categorias)
- [Customização](#customização)
- [Animações](#animações)
- [SEO e Acessibilidade](#seo-e-acessibilidade)
- [Exemplos Avançados](#exemplos-avançados)
- [Troubleshooting](#troubleshooting)
- [Métricas e Analytics](#métricas-e-analytics)

---

## 🎯 Visão Geral

O componente FAQ Interativo foi desenvolvido para:

✅ **Reduzir Objeções** - Responder dúvidas antes que impeçam conversão  
✅ **Aumentar Confiança** - Transparência sobre sigilo, dados e processo  
✅ **Melhorar UX** - Busca e filtros para encontrar respostas rapidamente  
✅ **Engajar Usuários** - Animações suaves e design atraente  
✅ **SEO Friendly** - Schema markup para rich snippets do Google  

### Preview Visual

```
┌─────────────────────────────────────────────────────────┐
│                    🌟 Perguntas Frequentes              │
│                  Suas Dúvidas, Respondidas              │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔍 Buscar perguntas...                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Todas: 10] [Privacidade: 3] [Processo: 2]           │
│  [Comunidade: 2] [Resultados: 3]                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🛡️ Privacidade                                  ▼│   │
│  │ Meus dados estão seguros?                        │   │
│  │                                                   │   │
│  │ Sim, seus dados estão 100% protegidos...        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔒 Privacidade                                  ▶│   │
│  │ Como meus dados serão utilizados?                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│              [💬 Falar no WhatsApp]                    │
│              [📧 Enviar Email]                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Recursos Principais

### 1. Accordion Interativo
- **Expandir/Colapsar** - Um item por vez (single mode)
- **Animações Suaves** - Transições de 200ms
- **Ícones Rotativos** - Chevron indica estado
- **Primeiro Aberto** - FAQ #1 aberto por padrão

### 2. Busca em Tempo Real
- **Search Input** - Busca por pergunta e resposta
- **Highlight Results** - Mostra quantidade de resultados
- **Clear Button** - Limpar busca com um clique
- **Case Insensitive** - Não diferencia maiúsculas/minúsculas

### 3. Filtros por Categoria
- **4 Categorias** + "Todas"
- **Contadores** - Mostra quantidade de FAQs por categoria
- **Visual Feedback** - Categoria selecionada destacada
- **Ícones Personalizados** - Cada categoria tem seu ícone

### 4. Design Responsivo
- **Mobile First** - Otimizado para dispositivos móveis
- **Desktop Enhanced** - Melhor experiência em telas grandes
- **Touch Friendly** - Áreas de toque adequadas (44x44px)
- **Adaptive Layout** - Ajusta automaticamente ao viewport

### 5. Animações
- **Framer Motion** - Animações profissionais
- **Stagger Effect** - Itens aparecem em sequência
- **Hover States** - Feedback visual ao passar mouse
- **Smooth Transitions** - Todas as transições suaves

---

## 📦 Instalação

### Dependências Necessárias

```bash
# Instalar pacotes do Radix UI e utilitários
npm install @radix-ui/react-accordion class-variance-authority clsx tailwind-merge

# Instalar Framer Motion (para animações)
npm install framer-motion

# Instalar Lucide React (ícones)
npm install lucide-react
```

### Arquivos Criados

```
apps/web/
├── components/
│   ├── ui/
│   │   └── accordion.tsx          # Componente base do shadcn
│   └── FAQ.tsx                    # Componente FAQ completo
├── lib/
│   └── utils.ts                   # Utilitário cn() para classes
└── tailwind.config.ts             # Animações accordion
```

---

## 📁 Estrutura de Arquivos

### 1. accordion.tsx (shadcn/ui base)

Componente base do accordion usando Radix UI:

```typescript
// components/ui/accordion.tsx
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root
const AccordionItem = React.forwardRef<...>({ ... })
const AccordionTrigger = React.forwardRef<...>({ ... })
const AccordionContent = React.forwardRef<...>({ ... })

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

### 2. FAQ.tsx (componente principal)

Componente completo com todas as funcionalidades:

```typescript
// components/FAQ.tsx
"use client";

import { useState, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Lock, Clock, Users, FileCheck, Sparkles, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: "privacy" | "process" | "community" | "results";
}

export default function FAQ() {
  // Estado e lógica do componente
}
```

---

## 🚀 Uso Básico

### Integração na Página

```typescript
// app/page.tsx
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main>
      {/* Outras seções */}
      
      {/* FAQ Section */}
      <FAQ />
      
      {/* Footer */}
    </main>
  );
}
```

### Posicionamento Recomendado

O FAQ deve ser posicionado:

1. ✅ **Antes do Footer** - Última chance de responder dúvidas
2. ✅ **Depois dos Depoimentos** - Após construir confiança
3. ✅ **Antes do CTA Final** - Remove objeções antes da conversão

---

## ❓ Perguntas e Respostas

### FAQs Incluídos (10 perguntas)

#### 1. **Privacidade** (3 perguntas)

```typescript
{
  id: "faq-1",
  question: "Meus dados estão seguros? Como funciona o sigilo?",
  answer: "Sim, seus dados estão 100% protegidos. Seguimos a LGPD...",
  icon: <Shield className="w-5 h-5" />,
  category: "privacy"
}
```

**Tópicos cobertos:**
- Segurança dos dados (LGPD)
- Uso das informações
- Dados bancários (não são solicitados)

#### 2. **Processo** (2 perguntas)

```typescript
{
  id: "faq-3",
  question: "Quanto tempo leva para receber o diagnóstico?",
  answer: "Seu diagnóstico é gerado instantaneamente!...",
  icon: <Clock className="w-5 h-5" />,
  category: "process"
}
```

**Tópicos cobertos:**
- Tempo de resposta (instantâneo)
- Possibilidade de refazer

#### 3. **Comunidade** (2 perguntas)

```typescript
{
  id: "faq-5",
  question: "Como funciona a comunidade VIP no WhatsApp?",
  answer: "A comunidade VIP é um grupo exclusivo...",
  icon: <Users className="w-5 h-5" />,
  category: "community"
}
```

**Tópicos cobertos:**
- Funcionamento da comunidade
- Suporte e discordâncias

#### 4. **Resultados** (3 perguntas)

```typescript
{
  id: "faq-4",
  question: "O diagnóstico é realmente gratuito?",
  answer: "Sim, o diagnóstico financeiro é 100% gratuito...",
  icon: <FileCheck className="w-5 h-5" />,
  category: "results"
}
```

**Tópicos cobertos:**
- Gratuidade do serviço
- Profissionalismo do diagnóstico
- Materiais bônus

### Adicionar Nova Pergunta

```typescript
// Em FAQ.tsx, adicione ao array faqData:
const faqData: FAQItem[] = [
  // ... perguntas existentes
  {
    id: "faq-11",
    question: "Nova pergunta aqui?",
    answer: "Resposta detalhada aqui. Use parágrafos para melhor legibilidade.",
    icon: <Sparkles className="w-5 h-5" />,
    category: "results", // ou privacy, process, community
  }
];
```

---

## 🏷️ Categorias

### Categorias Disponíveis

| Categoria | Cor | Ícone | Quantidade | Uso |
|-----------|-----|-------|------------|-----|
| **Todas** | Roxo | ✨ Sparkles | 10 | Mostra todas |
| **Privacidade** | Verde | 🛡️ Shield | 3 | Segurança e dados |
| **Processo** | Azul | ⏰ Clock | 2 | Como funciona |
| **Comunidade** | Roxo | 👥 Users | 2 | Grupo e suporte |
| **Resultados** | Rosa | ✅ FileCheck | 3 | Diagnóstico e bônus |

### Cores das Categorias

```typescript
const categoryColors = {
  privacy: "text-green-400",
  process: "text-blue-400",
  community: "text-purple-400",
  results: "text-pink-400",
};

const categoryBadges = {
  privacy: { 
    label: "Privacidade", 
    color: "bg-green-500/10 text-green-400" 
  },
  process: { 
    label: "Processo", 
    color: "bg-blue-500/10 text-blue-400" 
  },
  community: { 
    label: "Comunidade", 
    color: "bg-purple-500/10 text-purple-400" 
  },
  results: { 
    label: "Resultados", 
    color: "bg-pink-500/10 text-pink-400" 
  },
};
```

### Adicionar Nova Categoria

```typescript
// 1. Adicionar tipo
type Category = "privacy" | "process" | "community" | "results" | "nova_categoria";

// 2. Adicionar cores
const categoryColors = {
  // ... existentes
  nova_categoria: "text-yellow-400",
};

const categoryBadges = {
  // ... existentes
  nova_categoria: { 
    label: "Nova Categoria", 
    color: "bg-yellow-500/10 text-yellow-400" 
  },
};

// 3. Adicionar ao filtro
const categories = [
  // ... existentes
  {
    id: "nova_categoria",
    label: "Nova Categoria",
    icon: <Star className="w-4 h-4" />,
    count: faqData.filter((f) => f.category === "nova_categoria").length,
  },
];
```

---

## 🎨 Customização

### Alterar Cores do Tema

```typescript
// Em FAQ.tsx, modifique as classes:

// Background da seção
className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800"
// Para:
className="py-20 px-4 bg-gradient-to-b from-blue-900 to-blue-800"

// Cor dos botões de categoria
className="bg-purple-500"
// Para:
className="bg-blue-500"
```

### Alterar Textos do Header

```typescript
<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
  Suas Dúvidas,{" "}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
    Respondidas
  </span>
</h2>
<p className="text-gray-400 text-lg max-w-2xl mx-auto">
  Seu texto personalizado aqui.
</p>
```

### Customizar Ícones

```typescript
// Trocar ícones das perguntas
import { Shield, Lock, Clock, Users, FileCheck, Sparkles, Star, Trophy } from "lucide-react";

// Uso:
icon: <Star className="w-5 h-5" />
icon: <Trophy className="w-5 h-5" />
```

### Alterar Comportamento do Accordion

```typescript
// Single mode (padrão) - apenas um aberto por vez
<Accordion type="single" collapsible>

// Multiple mode - vários abertos ao mesmo tempo
<Accordion type="multiple">

// Definir item aberto por padrão
<Accordion 
  type="single" 
  collapsible 
  defaultValue="faq-1"  // ou "faq-2", "faq-3", etc.
>
```

---

## 🎬 Animações

### Configuração Tailwind

```typescript
// tailwind.config.ts
keyframes: {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
},
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
},
```

### Framer Motion Variants

```typescript
// Entrada da seção
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>

// Stagger effect nos itens
{faqData.map((faq, index) => (
  <motion.div
    key={faq.id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
  >
))}
```

### Customizar Velocidade

```typescript
// Animação mais rápida
transition={{ duration: 0.2, delay: index * 0.03 }}

// Animação mais lenta
transition={{ duration: 0.8, delay: index * 0.1 }}

// Sem delay
transition={{ duration: 0.4 }}
```

---

## ♿ SEO e Acessibilidade

### Schema Markup (FAQ)

Adicione schema markup para rich snippets no Google:

```typescript
// Em FAQ.tsx, adicione ao component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    })
  }}
/>
```

### Acessibilidade (WCAG 2.1 AA)

✅ **Keyboard Navigation**
- Tab para navegar entre perguntas
- Enter/Space para expandir/colapsar
- Setas para navegar dentro do accordion

✅ **Screen Readers**
- Roles ARIA apropriados
- Labels descritivos
- Estados anunciados (expandido/colapsado)

✅ **Contraste de Cores**
- Texto branco em fundo escuro (21:1)
- Ícones com cores distintas (7:1+)
- Hover states visíveis

✅ **Touch Targets**
- Mínimo 44x44px (WCAG AA)
- Espaçamento adequado entre elementos
- Áreas clicáveis generosas

### Testes de Acessibilidade

```bash
# Lighthouse audit
npm run build
npm run start
# Abrir DevTools > Lighthouse > Run audit

# axe DevTools
# Instalar extensão no navegador
# Rodar análise na página
```

---

## 💡 Exemplos Avançados

### 1. FAQ com Analytics

```typescript
import { trackEvent } from "@/lib/analytics";

// No onClick do AccordionTrigger
<AccordionTrigger 
  onClick={() => {
    trackEvent("faq_opened", {
      question: faq.question,
      category: faq.category,
      faq_id: faq.id
    });
  }}
>
```

### 2. FAQ com Feedback

```typescript
const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

// Adicionar botões de feedback
<div className="mt-4 flex gap-2">
  <button
    onClick={() => handleVote(faq.id, "helpful")}
    className="text-sm text-green-400 hover:text-green-300"
  >
    👍 Útil ({helpfulVotes[faq.id] || 0})
  </button>
  <button
    onClick={() => handleVote(faq.id, "not_helpful")}
    className="text-sm text-red-400 hover:text-red-300"
  >
    👎 Não útil
  </button>
</div>
```

### 3. FAQ com Sugestões

```typescript
// Mostrar FAQs relacionados
const relatedFAQs = faqData
  .filter(f => f.category === currentFAQ.category && f.id !== currentFAQ.id)
  .slice(0, 3);

<div className="mt-6 border-t border-gray-700 pt-6">
  <h4 className="text-sm font-semibold text-gray-400 mb-3">
    Perguntas Relacionadas
  </h4>
  <div className="space-y-2">
    {relatedFAQs.map(faq => (
      <button
        key={faq.id}
        className="text-sm text-purple-400 hover:text-purple-300"
      >
        {faq.question}
      </button>
    ))}
  </div>
</div>
```

### 4. FAQ com Tooltip

```typescript
import * as Tooltip from "@radix-ui/react-tooltip";

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <HelpCircle className="w-4 h-4 text-gray-400" />
    </Tooltip.Trigger>
    <Tooltip.Content>
      Clique para ver mais detalhes
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

---

## 🐛 Troubleshooting

### Accordion não expande/colapsa

**Problema:** Clicar no accordion não faz nada.

**Solução:**
```typescript
// Verificar se o Accordion tem type e collapsible
<Accordion type="single" collapsible>

// Verificar se cada item tem um value único
<AccordionItem value="faq-1">
<AccordionItem value="faq-2">
```

### Animações não funcionam

**Problema:** Accordion abre/fecha sem animação.

**Solução:**
```typescript
// 1. Verificar tailwind.config.ts
keyframes: {
  "accordion-down": { ... },
  "accordion-up": { ... },
}

// 2. Verificar classes no AccordionContent
className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
```

### Busca não filtra

**Problema:** Digitar na busca não filtra as perguntas.

**Solução:**
```typescript
// Verificar se useMemo está configurado corretamente
const filteredFAQs = useMemo(() => {
  // ... lógica de filtro
}, [selectedCategory, searchQuery]); // Dependências corretas

// Verificar se key está no Accordion
<Accordion key={selectedCategory}>
```

### Ícones não aparecem

**Problema:** Ícones das categorias não são exibidos.

**Solução:**
```bash
# Instalar lucide-react
npm install lucide-react

# Importar ícones corretamente
import { Shield, Lock, Clock } from "lucide-react";
```

### Build falha

**Problema:** Erro ao fazer build do Next.js.

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf .next node_modules
npm install
npm run build

# Verificar versões
npm ls @radix-ui/react-accordion
npm ls framer-motion
```

---

## 📊 Métricas e Analytics

### Eventos para Rastrear

```typescript
// 1. FAQ aberto
trackEvent("faq_opened", {
  question: faq.question,
  category: faq.category,
  faq_id: faq.id,
  timestamp: Date.now()
});

// 2. Busca realizada
trackEvent("faq_searched", {
  query: searchQuery,
  results_count: filteredFAQs.length
});

// 3. Categoria filtrada
trackEvent("faq_category_filtered", {
  category: selectedCategory,
  count: filteredFAQs.length
});

// 4. CTA clicado
trackEvent("faq_cta_clicked", {
  cta_type: "whatsapp", // ou "email"
  source: "faq_section"
});
```

### KPIs Importantes

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **FAQ Open Rate** | % de usuários que abrem FAQs | >30% |
| **Most Opened FAQ** | Pergunta mais aberta | Monitorar top 3 |
| **Search Usage** | % que usa busca | >15% |
| **Category Distribution** | FAQs mais vistas por categoria | Balanceado |
| **CTA Click Rate** | % que clica em WhatsApp/Email | >5% |
| **Bounce Reduction** | Redução de bounce após ver FAQ | -20% |

### Dashboard de Métricas

```typescript
// Exemplo de dashboard simples
interface FAQMetrics {
  totalViews: number;
  uniqueUsers: number;
  mostOpenedFAQ: string;
  searchUsage: number;
  ctaClicks: number;
  categoryBreakdown: Record<string, number>;
}

// Fetch metrics
const metrics = await fetch("/api/analytics/faq").then(r => r.json());

// Exibir no admin
<div className="grid grid-cols-3 gap-4">
  <MetricCard title="Total Views" value={metrics.totalViews} />
  <MetricCard title="Most Opened" value={metrics.mostOpenedFAQ} />
  <MetricCard title="Search Usage" value={`${metrics.searchUsage}%`} />
</div>
```

---

## 🎯 Melhores Práticas

### 1. Conteúdo

✅ **Respostas Completas** - Não deixe dúvidas na resposta  
✅ **Tom Amigável** - Use linguagem acessível  
✅ **Transparência** - Seja honesto sobre limitações  
✅ **Call-to-Action** - Direcione para próximo passo  
✅ **Atualizações** - Revise FAQs regularmente  

### 2. UX

✅ **Primeiro Aberto** - FAQ #1 aberto por padrão  
✅ **Ordem Lógica** - Perguntas mais importantes primeiro  
✅ **Categorização** - Agrupe perguntas similares  
✅ **Busca Rápida** - Facilite encontrar respostas  
✅ **Mobile First** - Teste em dispositivos móveis  

### 3. Performance

✅ **Lazy Loading** - Carregue FAQ só quando visível  
✅ **Memoização** - Use useMemo para filtros  
✅ **Otimize Imagens** - Comprima ícones se usar imagens  
✅ **Code Splitting** - Separe código do FAQ  
✅ **Prefetch** - Pré-carregue recursos críticos  

### 4. SEO

✅ **Schema Markup** - Adicione FAQ schema  
✅ **Headings Corretos** - Use h2, h3 semanticamente  
✅ **Meta Tags** - Adicione descriptions relevantes  
✅ **URLs Amigáveis** - Use anchors (#faq-section)  
✅ **Rich Snippets** - Otimize para Google  

---

## 🚀 Roadmap

### Próximas Melhorias

**v1.1 (Curto Prazo)**
- [ ] Votação útil/não útil em cada FAQ
- [ ] Sugestões de FAQs relacionados
- [ ] Compartilhar FAQ específico
- [ ] Print FAQ para PDF

**v1.2 (Médio Prazo)**
- [ ] AI-powered search (busca semântica)
- [ ] Respostas em vídeo
- [ ] Chatbot integrado
- [ ] Multi-idioma

**v1.3 (Longo Prazo)**
- [ ] FAQ personalizado por perfil de usuário
- [ ] A/B testing de respostas
- [ ] Analytics dashboard completo
- [ ] Integração com CRM

---

## 📚 Recursos Adicionais

### Documentação de Dependências

- [Radix UI Accordion](https://www.radix-ui.com/primitives/docs/components/accordion)
- [shadcn/ui Accordion](https://ui.shadcn.com/docs/components/accordion)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

### Artigos Relacionados

- [Best Practices for FAQ Pages](https://example.com)
- [FAQ Schema Markup Guide](https://schema.org/FAQPage)
- [Accessibility in Accordions](https://example.com)

### Comunidade

- 💬 Discord: [discord.gg/finanpsi](https://discord.com)
- 📧 Email: suporte@finanpsi.com
- 🐛 Issues: [GitHub Issues](https://github.com)

---

## 📄 Changelog

### v1.0.0 (Dezembro 2024)
- ✨ FAQ interativo com 10 perguntas
- 🔍 Busca em tempo real
- 🏷️ Filtros por 4 categorias
- 🎨 Design responsivo
- ♿ Acessibilidade WCAG AA
- 🎬 Animações com Framer Motion
- 📊 Schema markup para SEO
- 🚀 CTA para WhatsApp e Email
- 🎯 Trust indicators no footer

---

## 🙏 Créditos

**Desenvolvido por:** Leonardo Costa  
**Design System:** shadcn/ui  
**Animações:** Framer Motion  
**Ícones:** Lucide React  
**Framework:** Next.js 15  

---

<div align="center">

**Documentação v1.0.0** • **Dezembro 2024**

[⭐ Star no GitHub](https://github.com) • [🐛 Report Bug](https://github.com) • [✨ Request Feature](https://github.com)

</div>
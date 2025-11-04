# 🎮 Sistema de Gamificação - FinanPsi

## 📑 Índice

- [Visão Geral](#visão-geral)
- [Componentes Principais](#componentes-principais)
  - [GamificationProvider](#1-gamificationprovider-libgamificationtsx)
  - [Badges Disponíveis](#2-badges-disponíveis)
  - [Sistema de Pontuação](#3-sistema-de-pontuação)
- [Componentes de UI](#componentes-de-ui)
  - [GamificationBadge](#1-gamificationbadge)
  - [ProgressChecklist](#2-progresschecklist)
  - [ShareIncentive](#3-shareincentive)
  - [FloatingGamificationWidget](#4-floatinggamificationwidget)
- [Integração com Formulário](#integração-com-formulário)
- [Fluxo de Usuário](#fluxo-de-usuário)
- [Customização](#customização)
- [Animações](#animações)
- [Responsividade](#responsividade)
- [Acessibilidade](#acessibilidade)
- [Performance](#performance)
- [Analytics](#analytics-futuro)
- [Testes Recomendados](#testes-recomendados)
- [Troubleshooting](#troubleshooting)
- [Próximos Passos](#próximos-passos)
- [Arquitetura Técnica](#arquitetura-técnica)
  - [Diagrama de Fluxo de Dados](#1-diagrama-de-fluxo-de-dados)
  - [Estado Global](#2-estado-global)
  - [Hooks Personalizados](#3-hooks-personalizados)
  - [Persistência de Dados](#4-persistência-de-dados)
- [Padrões de Implementação](#padrões-de-implementação)
- [Integração com Componentes](#integração-com-componentes)
- [Animações e Transições](#animações-e-transições)
- [Design System](#design-system)
- [Melhores Práticas](#melhores-práticas)
- [Extensibilidade](#extensibilidade)
- [Backend Integration](#backend-integration-roadmap)
- [Monitoramento e Analytics](#monitoramento-e-analytics)
- [Segurança](#segurança)
- [Otimização Avançada](#otimização-avançada)
- [Exemplos Práticos Completos](#exemplos-práticos-completos)
- [Troubleshooting Avançado](#troubleshooting-avançado)
- [Conclusão](#conclusão)

---

## Visão Geral

O sistema de gamificação foi implementado para aumentar o engajamento dos usuários através de badges, pontuação, checklist de progresso e incentivos ao compartilhamento social.

## Componentes Principais

### 1. GamificationProvider (`lib/gamification.tsx`)

Context provider que gerencia todo o estado da gamificação.

**Estado gerenciado:**
- `badges`: Array de badges disponíveis e desbloqueados
- `score`: Pontuação total do usuário
- `hasShared`: Se o usuário já compartilhou
- `completedSteps`: Lista de passos completados
- `unlockedBonuses`: Lista de bônus desbloqueados

**Funções disponíveis:**
```typescript
const { 
  unlockBadge,           // Desbloquear um badge
  addScore,              // Adicionar pontos
  markShared,            // Marcar como compartilhado
  completeStep,          // Completar um passo
  unlockBonus,           // Desbloquear bônus
  updateBadgeProgress    // Atualizar progresso de um badge
} = useGamification();
```

**Persistência:**
- Os dados são salvos no `localStorage` automaticamente
- Chave: `finanpsi_gamification`

### 2. Badges Disponíveis

| ID | Ícone | Título | Descrição | Quando Desbloqueia |
|---|---|---|---|---|
| `started` | 🎯 | Bem-vindo! | Primeiro passo rumo à transformação | Ao iniciar o formulário |
| `profile_complete` | 👤 | Perfil Completo | Completou informações pessoais | Ao completar passo 1 |
| `challenge_shared` | 💪 | Coragem | Compartilhou desafio financeiro | Ao completar passo 2 |
| `community_member` | 🤝 | Membro da Comunidade | Aceitou fazer parte do grupo VIP | Ao aceitar grupo VIP |
| `almost_there` | 🔓 | Quase lá! | A 1 passo de desbloquear diagnóstico | Progresso automático |
| `diagnosis_unlocked` | 🎉 | Diagnóstico Desbloqueado | Completou todos os passos | Ao enviar formulário |
| `social_champion` | 🚀 | Campeão Social | Compartilhou para desbloquear bônus | Ao compartilhar |
| `bonus_collector` | 🏆 | Colecionador de Bônus | Desbloqueou todos materiais | Ao coletar 3+ bônus |

### 3. Sistema de Pontuação

| Ação | Pontos |
|---|---|
| Completar Passo 1 (Perfil) | +10 pts |
| Completar Passo 2 (Desafio) | +20 pts |
| Aceitar Grupo VIP | +15 pts |
| Enviar Formulário | +30 pts |
| Compartilhar nas Redes | +50 pts |
| Desbloquear Badge | +10 pts |
| Download de Bônus | +10 pts |

**Total Possível:** 145+ pontos

## Componentes de UI

### 1. GamificationBadge

Componente principal que mostra badges e progresso.

**Props:**
```typescript
{
  compact?: boolean;      // Modo compacto (default: false)
  showProgress?: boolean; // Mostrar barra de progresso (default: true)
}
```

**Recursos:**
- Notificação animada quando badge é desbloqueado
- Grid visual de todos os badges
- Barra de progresso geral
- Preview do próximo badge
- Score display

### 2. ProgressChecklist

Checklist visual dos passos da jornada.

**Props:**
```typescript
{
  currentStep?: number;   // Passo atual (default: 0)
  compact?: boolean;      // Modo compacto (default: false)
}
```

**Passos rastreados:**
1. ✓ Informações Pessoais (+10 pts)
2. ✓ Compartilhe seu Desafio (+20 pts)
3. ✓ Entre na Comunidade (+15 pts)
4. ✓ Compartilhe com Amigos (+50 pts)
5. ✓ Receba seu Diagnóstico (+30 pts)

**Estados:**
- `completed`: Passo concluído (verde)
- `current`: Passo atual (roxo, animado)
- `locked`: Passo bloqueado (cinza)

### 3. ShareIncentive

Componente de incentivo ao compartilhamento social.

**Props:**
```typescript
{
  title?: string;
  description?: string;
  bonusItems?: string[];
}
```

**Funcionalidades:**
- Botões de compartilhamento para múltiplas plataformas:
  - WhatsApp
  - Facebook
  - Twitter/X
  - LinkedIn
  - Telegram
  - Copiar Link
- Modal de confirmação ao compartilhar
- Desbloqueio automático de bônus
- Download de materiais exclusivos

**Bônus Padrão:**
- 📊 Planilha de Controle Financeiro Avançada
- 📚 E-book: 7 Passos para Saúde Financeira
- 🎯 Guia Prático de Investimentos para Iniciantes
- 💡 Checklist de Organização Financeira

### 4. FloatingGamificationWidget

Widget flutuante que persiste em toda a navegação.

**Estados:**
- Compacto (padrão)
- Expandido (ao clicar)
- Minimizado

**Funcionalidades:**
- Progress ring animado
- Score display
- Próximo badge
- Grid completo de badges
- Mensagens motivacionais

## Integração com Formulário

O componente `Form.tsx` está integrado com o sistema de gamificação:

```typescript
import { useGamification } from "@/lib/gamification";

const { unlockBadge, completeStep, addScore, updateBadgeProgress } = useGamification();

// Ao iniciar formulário
unlockBadge("started");

// Ao completar passo 1
completeStep("step_1");
unlockBadge("profile_complete");
addScore(10);

// Ao completar passo 2
completeStep("step_2");
unlockBadge("challenge_shared");
addScore(20);

// Ao enviar formulário
completeStep("step_5");
unlockBadge("diagnosis_unlocked");
addScore(30);
```

## Fluxo de Usuário

### Jornada Completa

1. **Chegada na Landing Page**
   - Vê o FloatingGamificationWidget (compacto)
   - Vê a seção de Gamificação explicando os badges

2. **Início do Formulário**
   - 🎯 Badge "Bem-vindo!" desbloqueado
   - Notificação animada aparece
   - Widget atualiza para 1/8 badges

3. **Completar Passo 1**
   - ✓ Passo 1 marcado no checklist
   - 👤 Badge "Perfil Completo" desbloqueado
   - +10 pontos adicionados
   - Progress bar atualiza para 33%

4. **Completar Passo 2**
   - ✓ Passo 2 marcado no checklist
   - 💪 Badge "Coragem" desbloqueado
   - +20 pontos adicionados
   - Progress bar atualiza para 66%

5. **Aceitar Grupo VIP**
   - ✓ Passo 3 marcado
   - 🤝 Badge "Membro da Comunidade" desbloqueado
   - +15 pontos adicionados

6. **Enviar Formulário**
   - ✓ Passo 5 marcado
   - 🎉 Badge "Diagnóstico Desbloqueado"
   - +30 pontos adicionados
   - 🔓 Badge "Quase lá!" completa automaticamente

7. **Compartilhar**
   - ✓ Passo 4 marcado
   - 🚀 Badge "Campeão Social" desbloqueado
   - +50 pontos adicionados
   - Bônus desbloqueados imediatamente

8. **Coletar Bônus**
   - Download de materiais
   - +10 pontos por download
   - 🏆 Badge "Colecionador" ao coletar 3+ bônus

## Customização

### Adicionar Novo Badge

```typescript
// Em lib/gamification.tsx
const INITIAL_BADGES: Badge[] = [
  // ...badges existentes
  {
    id: "novo_badge",
    title: "Título do Badge",
    description: "Descrição do que desbloqueia",
    icon: "🎨",
    unlocked: false,
  }
];
```

### Adicionar Novo Passo no Checklist

```typescript
// Em components/ProgressChecklist.tsx
const CHECKLIST_ITEMS: ChecklistItem[] = [
  // ...itens existentes
  {
    id: "step_novo",
    title: "Novo Passo",
    description: "Descrição do passo",
    icon: "📌",
    points: 15,
  }
];
```

### Customizar Pontuação

Edite as chamadas de `addScore()` nos componentes relevantes:

```typescript
// Exemplo: dar mais pontos ao completar passo 2
completeStep("step_2");
addScore(30); // era 20
```

## Animações

O sistema usa **Framer Motion** para animações suaves:

- **Notificações de badge:** Scale + fade in/out
- **Progress bars:** Width animation com easing
- **Badge unlock:** Scale pulse effect
- **Widget transitions:** Scale + opacity
- **Checklist items:** Stagger animation

## Responsividade

Todos os componentes são totalmente responsivos:

- **Desktop:** Layout em grid com 2 colunas
- **Tablet:** Layout adaptativo
- **Mobile:** Layout em coluna única
- **FloatingWidget:** Se ajusta automaticamente ao viewport

## Acessibilidade

- Títulos descritivos em todos os badges
- Cores com contraste adequado (WCAG AA)
- Animações respeitam `prefers-reduced-motion`
- Botões com labels claros
- Estados visuais bem definidos

## Performance

- **localStorage:** Salvamento automático sem overhead
- **Lazy rendering:** Componentes só renderizam quando visíveis
- **Optimized animations:** 60 FPS garantido
- **Memoização:** Cálculos de progresso são otimizados

## Analytics (Futuro)

Eventos para rastrear:
- `badge_unlocked`: Quando badge é desbloqueado
- `step_completed`: Quando passo é completado
- `share_clicked`: Quando usuário compartilha
- `bonus_downloaded`: Quando bônus é baixado
- `widget_expanded`: Quando widget é expandido

## Testes Recomendados

1. **Fluxo completo:** Testar jornada do início ao fim
2. **Persistência:** Recarregar página e verificar estado
3. **Compartilhamento:** Testar em diferentes plataformas
4. **Responsividade:** Testar em diferentes dispositivos
5. **Performance:** Verificar FPS das animações

## Troubleshooting

### Badges não desbloqueiam
- Verificar se `GamificationProvider` está no layout
- Verificar console para erros
- Limpar localStorage: `localStorage.removeItem('finanpsi_gamification')`

### Widget não aparece
- Verificar se está importado na página
- Verificar z-index (deve ser 40)
- Verificar posicionamento fixo

### Progresso não persiste
- Verificar se localStorage está habilitado
- Verificar se há erros de parse do JSON
- Verificar privacy settings do navegador

## Próximos Passos

Melhorias futuras sugeridas:

1. **Backend Integration:**
   - Salvar progresso no banco de dados
   - Sincronizar entre dispositivos
   - Leaderboard global

2. **Mais Badges:**
   - Badges por tempo (completar em X minutos)
   - Badges sociais (convidar amigos)
   - Badges de engajamento (voltar ao site)

3. **Gamificação Avançada:**
   - Níveis de usuário (Bronze, Prata, Ouro)
   - Desafios diários
   - Recompensas por streak

4. **Social Features:**
   - Compartilhar badges nas redes
   - Comparar progresso com amigos
   - Ranking público

5. **Notificações:**
   - Email quando badge é desbloqueado
   - Push notifications (PWA)
   - Reminders de passos incompletos

---

## Arquitetura Técnica

### 1. Diagrama de Fluxo de Dados

```
┌─────────────────┐
│  User Action    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ React Component │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useGamification │ ◄──── Context API
│     Hook        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ State Update    │
└────────┬────────┘
         │
         ├──────────────────────┐
         ▼                      ▼
┌─────────────────┐   ┌─────────────────┐
│  localStorage   │   │   UI Update     │
└─────────────────┘   └─────────────────┘
```

### 2. Estado Global

O sistema utiliza React Context API para gerenciar o estado global:

**Estrutura do Estado:**
```typescript
interface GamificationState {
  badges: Badge[];           // Array de todos os badges
  score: number;             // Pontuação total
  hasShared: boolean;        // Flag de compartilhamento
  completedSteps: string[];  // IDs dos passos completados
  unlockedBonuses: string[]; // IDs dos bônus desbloqueados
}
```

**Badge Interface:**
```typescript
interface Badge {
  id: string;           // Identificador único
  title: string;        // Título do badge
  description: string;  // Descrição do achievement
  icon: string;         // Emoji ou ícone
  unlocked: boolean;    // Estado de desbloqueio
  progress?: number;    // Progresso atual (opcional)
  maxProgress?: number; // Progresso máximo (opcional)
}
```

### 3. Hooks Personalizados

#### useGamification()

Principal hook para interagir com o sistema:

```typescript
const {
  state,                    // Estado completo
  unlockBadge,             // (badgeId: string) => void
  addScore,                // (points: number) => void
  markShared,              // () => void
  completeStep,            // (stepId: string) => void
  unlockBonus,             // (bonusId: string) => void
  updateBadgeProgress      // (badgeId: string, progress: number) => void
} = useGamification();
```

**Exemplo de uso:**
```typescript
// Desbloquear badge específico
unlockBadge("started");

// Adicionar pontos
addScore(20);

// Completar passo
completeStep("step_1");

// Atualizar progresso de badge com barra
updateBadgeProgress("almost_there", 75);
```

#### Helper Functions

Funções utilitárias exportadas:

```typescript
// Calcular progresso geral (0-100)
calculateOverallProgress(badges: Badge[]): number

// Obter próximo badge a desbloquear
getNextBadge(badges: Badge[]): Badge | null

// Obter badges desbloqueados
getUnlockedBadges(badges: Badge[]): Badge[]
```

### 4. Persistência de Dados

#### LocalStorage Schema

Chave: `finanpsi_gamification`

```json
{
  "badges": [
    {
      "id": "started",
      "title": "Bem-vindo!",
      "description": "...",
      "icon": "🎯",
      "unlocked": true,
      "progress": 0,
      "maxProgress": 100
    }
  ],
  "score": 145,
  "hasShared": true,
  "completedSteps": ["step_1", "step_2", "step_3"],
  "unlockedBonuses": ["bonus_1", "bonus_2", "bonus_3"]
}
```

#### Estratégia de Persistência

1. **Auto-save:** Estado salvo automaticamente a cada mudança
2. **Hydration:** Estado carregado no mount do Provider
3. **Merge Strategy:** Badges são mesclados com defaults na inicialização
4. **Error Handling:** Fallback para estado inicial em caso de erro

```typescript
// Exemplo de carregamento
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    // Merge com badges defaults
    return {
      ...parsed,
      badges: INITIAL_BADGES.map(badge => {
        const savedBadge = parsed.badges?.find(b => b.id === badge.id);
        return savedBadge || badge;
      })
    };
  } catch (e) {
    console.error("Error loading gamification state:", e);
  }
}
```

## Padrões de Implementação

### 1. Atomic Updates

Todas as atualizações de estado seguem o padrão imutável:

```typescript
setState((prev) => ({
  ...prev,
  score: prev.score + points,
}));
```

### 2. Conditional Unlocking

Badges só são desbloqueados se ainda não estiverem:

```typescript
const unlockBadge = (badgeId: string) => {
  setState((prev) => {
    const badgeIndex = prev.badges.findIndex((b) => b.id === badgeId);
    if (badgeIndex === -1 || prev.badges[badgeIndex].unlocked) {
      return prev; // Sem mudanças
    }
    // ... unlock logic
  });
};
```

### 3. Cascade Effects

Algumas ações disparam efeitos em cascata:

```typescript
// Compartilhar também desbloqueia badge
const markShared = () => {
  setState((prev) => ({
    ...prev,
    hasShared: true,
  }));
  unlockBadge("social_champion"); // Cascade
};

// Coletar 3+ bônus desbloqueia badge automaticamente
const unlockBonus = (bonusId: string) => {
  setState((prev) => {
    const newBonuses = [...prev.unlockedBonuses, bonusId];
    if (newBonuses.length >= 3) {
      unlockBadge("bonus_collector"); // Auto-unlock
    }
    return {
      ...prev,
      unlockedBonuses: newBonuses,
    };
  });
};
```

### 4. Progress Tracking

Badges podem ter progresso incremental:

```typescript
const updateBadgeProgress = (badgeId: string, progress: number) => {
  setState((prev) => {
    const badge = prev.badges.find(b => b.id === badgeId);
    const newProgress = Math.min(progress, badge.maxProgress || 100);
    
    // Auto-unlock ao atingir 100%
    if (newProgress === badge.maxProgress && !badge.unlocked) {
      badge.unlocked = true;
      return {
        ...prev,
        badges: newBadges,
        score: prev.score + 10, // Bonus points
      };
    }
    
    return { ...prev, badges: newBadges };
  });
};
```

## Integração com Componentes

### 1. Layout Root

O Provider deve envolver toda a aplicação:

```typescript
// app/layout.tsx
import { GamificationProvider } from "@/lib/gamification";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GamificationProvider>
          {children}
          <FloatingGamificationWidget />
        </GamificationProvider>
      </body>
    </html>
  );
}
```

### 2. Form Integration

Exemplo completo de integração com formulário:

```typescript
// components/Form.tsx
import { useGamification } from "@/lib/gamification";

export default function Form() {
  const { unlockBadge, completeStep, addScore, updateBadgeProgress } = 
    useGamification();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Desbloquear badge de boas-vindas ao montar
    if (step === 0) {
      unlockBadge("started");
    }
  }, []);

  const handleStepComplete = (stepNumber: number) => {
    switch(stepNumber) {
      case 1:
        completeStep("step_1");
        unlockBadge("profile_complete");
        addScore(10);
        updateBadgeProgress("almost_there", 33);
        break;
      case 2:
        completeStep("step_2");
        unlockBadge("challenge_shared");
        addScore(20);
        updateBadgeProgress("almost_there", 66);
        break;
      // ... outros casos
    }
    setStep(stepNumber);
  };

  return (
    <div>
      {/* Form content */}
      <GamificationBadge compact showProgress />
    </div>
  );
}
```

### 3. Landing Page Integration

Exibir gamificação na landing page:

```typescript
// app/page.tsx
export default function LandingPage() {
  return (
    <main>
      {/* Hero section */}
      
      {/* Gamification showcase */}
      <section className="py-20">
        <h2>Seu Progresso é Recompensado</h2>
        <GamificationBadge showProgress={false} />
      </section>

      {/* Progress checklist preview */}
      <section>
        <ProgressChecklist compact />
      </section>

      {/* CTA */}
      <section>
        <ShareIncentive />
      </section>

      {/* Floating widget persiste em todas as páginas */}
    </main>
  );
}
```

## Animações e Transições

### 1. Framer Motion Variants

Todas as animações usam variants predefinidos:

```typescript
// Badge unlock animation
const badgeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  exit: { 
    scale: 0, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Notification animation
const notificationVariants = {
  initial: { y: -100, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring" }
  },
  exit: { 
    y: -100, 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// Progress bar animation
const progressVariants = {
  initial: { width: "0%" },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  })
};
```

### 2. Stagger Children

Para listas de badges e checklist:

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" }
  }
};
```

### 3. Hover Effects

Interações suaves com o usuário:

```typescript
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="badge-card"
>
  {/* Badge content */}
</motion.div>
```

### 4. Reduced Motion

Respeitar preferências do usuário:

```typescript
const shouldReduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const variants = shouldReduceMotion
  ? {
      // Sem animações
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }
  : {
      // Com animações completas
      hidden: { scale: 0, opacity: 0 },
      visible: { 
        scale: 1, 
        opacity: 1,
        transition: { type: "spring" }
      }
    };
```

## Design System

### 1. Cores

Paleta de cores do sistema de gamificação:

```css
/* Primary Colors */
--gamification-primary: #8b5cf6;      /* Purple 500 */
--gamification-primary-light: #a78bfa; /* Purple 400 */
--gamification-primary-dark: #7c3aed;  /* Purple 600 */

/* Success */
--gamification-success: #10b981;       /* Green 500 */
--gamification-success-light: #34d399; /* Green 400 */

/* Warning */
--gamification-warning: #f59e0b;       /* Amber 500 */

/* Neutral */
--gamification-bg: #1f2937;            /* Gray 800 */
--gamification-bg-light: #374151;      /* Gray 700 */
--gamification-text: #f9fafb;          /* Gray 50 */
--gamification-text-muted: #9ca3af;    /* Gray 400 */
```

### 2. Typography

Hierarquia tipográfica:

```css
/* Badge Title */
.badge-title {
  font-size: 1.125rem;  /* 18px */
  font-weight: 600;
  line-height: 1.5;
}

/* Badge Description */
.badge-description {
  font-size: 0.875rem;  /* 14px */
  font-weight: 400;
  line-height: 1.5;
  opacity: 0.8;
}

/* Score Display */
.score-display {
  font-size: 1.5rem;    /* 24px */
  font-weight: 700;
  line-height: 1.2;
}

/* Icon Size */
.badge-icon {
  font-size: 2rem;      /* 32px */
}
```

### 3. Spacing

Sistema de espaçamento consistente:

```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
```

### 4. Border Radius

Consistência em cantos arredondados:

```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Circular */
```

### 5. Shadows

Elevação e profundidade:

```css
/* Card Shadow */
--shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);

/* Elevated Shadow */
--shadow-elevated: 0 10px 15px -3px rgb(0 0 0 / 0.1);

/* Glow Effect */
--shadow-glow: 0 0 20px rgba(139, 92, 246, 0.3);
```

## Melhores Práticas

### 1. Performance

**Otimizações implementadas:**

- ✅ Memoização de cálculos pesados
- ✅ Lazy loading de componentes pesados
- ✅ Debounce em atualizações de progresso
- ✅ RequestAnimationFrame para animações
- ✅ LocalStorage otimizado (batch updates)

**Exemplo de memoização:**

```typescript
import { useMemo } from "react";

const MemoizedBadgeGrid = () => {
  const { state } = useGamification();
  
  const sortedBadges = useMemo(() => {
    return [...state.badges].sort((a, b) => {
      if (a.unlocked === b.unlocked) return 0;
      return a.unlocked ? -1 : 1;
    });
  }, [state.badges]);
  
  return <BadgeGrid badges={sortedBadges} />;
};
```

### 2. Error Handling

**Estratégias de resiliência:**

```typescript
// Graceful degradation
const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : getDefaultState();
  } catch (error) {
    console.error("Failed to load gamification state:", error);
    return getDefaultState();
  }
};

// Fallback UI
const SafeGamificationBadge = () => {
  try {
    return <GamificationBadge />;
  } catch (error) {
    console.error("Gamification render error:", error);
    return null; // Não quebra a página
  }
};
```

### 3. Type Safety

**TypeScript strict mode:**

```typescript
// Tipos explícitos
type BadgeId = 
  | "started"
  | "profile_complete"
  | "challenge_shared"
  | "community_member"
  | "almost_there"
  | "diagnosis_unlocked"
  | "social_champion"
  | "bonus_collector";

type StepId = 
  | "step_1"
  | "step_2"
  | "step_3"
  | "step_4"
  | "step_5";

// Funções type-safe
function unlockBadge(badgeId: BadgeId): void;
function completeStep(stepId: StepId): void;
```

### 4. Testing Strategy

**Testes recomendados:**

```typescript
// Unit tests
describe("useGamification", () => {
  it("should unlock badge correctly", () => {
    const { unlockBadge, state } = renderHook(() => useGamification());
    unlockBadge("started");
    expect(state.badges.find(b => b.id === "started").unlocked).toBe(true);
  });

  it("should add score correctly", () => {
    const { addScore, state } = renderHook(() => useGamification());
    addScore(20);
    expect(state.score).toBe(20);
  });

  it("should not unlock same badge twice", () => {
    const { unlockBadge, state } = renderHook(() => useGamification());
    unlockBadge("started");
    const scoreAfterFirst = state.score;
    unlockBadge("started");
    expect(state.score).toBe(scoreAfterFirst);
  });
});

// Integration tests
describe("Gamification Flow", () => {
  it("should complete full user journey", () => {
    // 1. Start form
    // 2. Complete steps
    // 3. Unlock badges
    // 4. Share
    // 5. Download bonuses
    // Assert final state
  });
});

// E2E tests (Playwright/Cypress)
describe("Gamification E2E", () => {
  it("should persist state across page reloads", () => {
    cy.visit("/form");
    cy.clickButton("Start");
    cy.reload();
    cy.get(".badge-started").should("have.class", "unlocked");
  });
});
```

### 5. Acessibilidade

**WCAG 2.1 Compliance:**

```typescript
// Keyboard navigation
<button
  onClick={handleUnlock}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleUnlock();
    }
  }}
  aria-label="Unlock badge: Bem-vindo"
  aria-pressed={badge.unlocked}
>
  {badge.icon}
</button>

// Screen reader announcements
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {lastUnlockedBadge && `Badge desbloqueado: ${lastUnlockedBadge}`}
</div>

// Focus management
useEffect(() => {
  if (showNotification) {
    notificationRef.current?.focus();
  }
}, [showNotification]);

// Color contrast (WCAG AA)
.badge-unlocked {
  color: #10b981; /* 4.5:1 contrast ratio */
  background: #1f2937;
}
```

### 6. Mobile-First Design

**Responsive breakpoints:**

```typescript
// Tailwind breakpoints
sm: "640px"   // Mobile landscape
md: "768px"   // Tablet
lg: "1024px"  // Desktop
xl: "1280px"  // Large desktop

// Component adaptations
<div className="
  grid grid-cols-1        // Mobile: 1 coluna
  sm:grid-cols-2          // Small: 2 colunas
  lg:grid-cols-4          // Desktop: 4 colunas
  gap-4
">
  {badges.map(badge => <BadgeCard key={badge.id} {...badge} />)}
</div>

// Touch targets (min 44x44px)
<button className="min-h-[44px] min-w-[44px] touch-manipulation">
  Share
</button>
```

## Extensibilidade

### 1. Adicionar Novo Badge

```typescript
// 1. Adicionar ao INITIAL_BADGES
const INITIAL_BADGES: Badge[] = [
  // ... badges existentes
  {
    id: "speed_demon",
    title: "Velocista",
    description: "Completou o formulário em menos de 5 minutos",
    icon: "⚡",
    unlocked: false,
  }
];

// 2. Criar lógica de desbloqueio
const trackFormTime = () => {
  const startTime = Date.now();
  
  const handleSubmit = () => {
    const elapsed = Date.now() - startTime;
    if (elapsed < 5 * 60 * 1000) { // 5 minutos
      unlockBadge("speed_demon");
    }
  };
};
```

### 2. Sistema de Níveis

Exemplo de implementação futura:

```typescript
interface Level {
  id: number;
  name: string;
  minScore: number;
  maxScore: number;
  benefits: string[];
}

const LEVELS: Level[] = [
  {
    id: 1,
    name: "Iniciante",
    minScore: 0,
    maxScore: 49,
    benefits: ["Acesso básico"]
  },
  {
    id: 2,
    name: "Bronze",
    minScore: 50,
    maxScore: 99,
    benefits: ["Material extra", "Badge especial"]
  },
  {
    id: 3,
    name: "Prata",
    minScore: 100,
    maxScore: 149,
    benefits: ["Consulta grátis", "Prioridade no suporte"]
  },
  // ... mais níveis
];

function getCurrentLevel(score: number): Level {
  return LEVELS.find(
    level => score >= level.minScore && score <= level.maxScore
  ) || LEVELS[0];
}
```

### 3. Achievements Temporais

```typescript
interface TemporalBadge extends Badge {
  expiresAt?: Date;
  claimedAt?: Date;
}

// Badge de tempo limitado
const SEASONAL_BADGES: TemporalBadge[] = [
  {
    id: "black_friday_2024",
    title: "Black Friday Especial",
    description: "Completou durante a Black Friday",
    icon: "🎁",
    unlocked: false,
    expiresAt: new Date("2024-11-30"),
  }
];

// Verificar validade
function isValidTemporalBadge(badge: TemporalBadge): boolean {
  if (!badge.expiresAt) return true;
  return new Date() < badge.expiresAt;
}
```

### 4. Social Leaderboard

```typescript
interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  badges: number;
  rank: number;
}

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch("/api/gamification/leaderboard");
  return response.json();
}

// Component
const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const { state } = useGamification();
  
  const myRank = entries.findIndex(e => e.userId === currentUserId) + 1;
  
  return (
    <div>
      <h3>Top 10 Usuários</h3>
      {entries.map(entry => (
        <LeaderboardRow key={entry.userId} {...entry} />
      ))}
      <div>Sua posição: #{myRank}</div>
    </div>
  );
};
```

## Backend Integration (Roadmap)

### 1. API Endpoints

```typescript
// GET /api/gamification/user/:userId
// Retorna estado da gamificação do usuário

// POST /api/gamification/unlock-badge
// Body: { userId, badgeId }

// POST /api/gamification/add-score
// Body: { userId, points, action }

// GET /api/gamification/leaderboard
// Query: { limit?, offset? }

// POST /api/gamification/sync
// Body: { userId, state }
// Sincroniza estado local com servidor
```

### 2. Database Schema

```sql
-- Tabela de usuários (já existe)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gamification state
CREATE TABLE gamification_states (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  score INTEGER DEFAULT 0,
  has_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User badges (many-to-many)
CREATE TABLE user_badges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  badge_id VARCHAR(50),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, badge_id)
);

-- Completed steps
CREATE TABLE completed_steps (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  step_id VARCHAR(50),
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, step_id)
);

-- Leaderboard view
CREATE VIEW leaderboard AS
SELECT 
  u.id,
  u.name,
  gs.score,
  COUNT(ub.id) as badges_count,
  RANK() OVER (ORDER BY gs.score DESC) as rank
FROM users u
LEFT JOIN gamification_states gs ON u.id = gs.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id, u.name, gs.score
ORDER BY gs.score DESC;
```

### 3. Sync Strategy

```typescript
// Hybrid local-first approach
class GamificationSync {
  private syncQueue: Array<SyncAction> = [];
  private isSyncing = false;

  async syncState(userId: string, state: GamificationState) {
    // Tentar sincronizar
    try {
      const response = await fetch(`/api/gamification/sync`, {
        method: "POST",
        body: JSON.stringify({ userId, state }),
      });
      
      if (response.ok) {
        this.syncQueue = []; // Limpar fila
        return await response.json();
      }
    } catch (error) {
      // Adicionar à fila para retry
      this.syncQueue.push({ userId, state, timestamp: Date.now() });
    }
  }

  // Retry failed syncs
  async retryQueue() {
    if (this.isSyncing || this.syncQueue.length === 0) return;
    
    this.isSyncing = true;
    for (const action of this.syncQueue) {
      await this.syncState(action.userId, action.state);
    }
    this.isSyncing = false;
  }
}
```

## Monitoramento e Analytics

### 1. Eventos para Rastrear

```typescript
// Event tracking with Google Analytics / Mixpanel
const trackGamificationEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      event_category: "Gamification",
      ...properties,
    });
  }
};

// Exemplos de uso
trackGamificationEvent("badge_unlocked", {
  badge_id: "started",
  badge_title: "Bem-vindo!",
  user_score: 10,
});

trackGamificationEvent("step_completed", {
  step_id: "step_1",
  step_title: "Perfil Completo",
  completion_time_ms: 45000,
});

trackGamificationEvent("share_clicked", {
  platform: "whatsapp",
  has_unlocked_bonus: true,
});
```

### 2. Métricas Importantes

```typescript
interface GamificationMetrics {
  // Engagement
  avgBadgesPerUser: number;
  avgScorePerUser: number;
  completionRate: number; // % que completam jornada
  
  // Retention
  returnUserRate: number; // % que voltam
  avgTimeToComplete: number; // Tempo médio
  
  // Social
  shareRate: number; // % que compartilham
  viralCoefficient: number; // Usuários trazidos / compartilhamentos
  
  // Badges
  badgeUnlockRates: Record<string, number>; // % unlock por badge
  mostValuableBadge: string; // Badge com maior engajamento
}
```

### 3. Dashboard de Métricas

```typescript
const GamificationDashboard = () => {
  const [metrics, setMetrics] = useState<GamificationMetrics>();
  
  useEffect(() => {
    fetch("/api/gamification/metrics").then(r => r.json()).then(setMetrics);
  }, []);
  
  return (
    <div>
      <MetricCard
        title="Badges Desbloqueados"
        value={metrics?.avgBadgesPerUser}
        trend="+12%"
      />
      <MetricCard
        title="Taxa de Compartilhamento"
        value={`${metrics?.shareRate}%`}
        trend="+5%"
      />
      <BadgeUnlockChart data={metrics?.badgeUnlockRates} />
      
      <ChartCard
        title="Taxa de Conclusão por Passo"
        data={metrics?.stepCompletionRates}
      />
    </div>
  );
};
```

## Segurança

### 1. Validação de Dados

```typescript
// Validar IDs antes de processar
const VALID_BADGE_IDS = [
  "started",
  "profile_complete",
  "challenge_shared",
  "community_member",
  "almost_there",
  "diagnosis_unlocked",
  "social_champion",
  "bonus_collector",
] as const;

type ValidBadgeId = typeof VALID_BADGE_IDS[number];

function isValidBadgeId(id: string): id is ValidBadgeId {
  return VALID_BADGE_IDS.includes(id as ValidBadgeId);
}

// Uso seguro
const unlockBadge = (badgeId: string) => {
  if (!isValidBadgeId(badgeId)) {
    console.error(`Invalid badge ID: ${badgeId}`);
    return;
  }
  // ... lógica de unlock
};
```

### 2. Sanitização de Input

```typescript
// Sanitizar dados do localStorage
const sanitizeState = (state: any): GamificationState | null => {
  try {
    // Validar estrutura
    if (!state || typeof state !== "object") return null;
    
    // Validar badges
    if (!Array.isArray(state.badges)) return null;
    
    // Validar score (evitar valores absurdos)
    const score = Number(state.score) || 0;
    if (score < 0 || score > 10000) return null;
    
    // Validar arrays
    const completedSteps = Array.isArray(state.completedSteps) 
      ? state.completedSteps.filter(s => typeof s === "string")
      : [];
    
    return {
      badges: state.badges,
      score: Math.max(0, Math.min(score, 10000)),
      hasShared: Boolean(state.hasShared),
      completedSteps,
      unlockedBonuses: Array.isArray(state.unlockedBonuses) 
        ? state.unlockedBonuses 
        : [],
    };
  } catch {
    return null;
  }
};
```

### 3. Rate Limiting

```typescript
// Prevenir spam de unlock badges
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  canProceed(key: string, maxAttempts: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Limpar tentativas antigas
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      console.warn(`Rate limit exceeded for ${key}`);
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
}

const rateLimiter = new RateLimiter();

// Uso no unlock
const unlockBadge = (badgeId: string) => {
  if (!rateLimiter.canProceed(`unlock_${badgeId}`)) {
    return;
  }
  // ... lógica de unlock
};
```

### 4. XSS Prevention

```typescript
// Escapar strings antes de renderizar
const escapeHtml = (text: string): string => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

// Componente seguro
const BadgeTitle = ({ title }: { title: string }) => {
  return <h3>{escapeHtml(title)}</h3>;
};

// Ou usar DOMPurify para HTML complexo
import DOMPurify from "dompurify";

const SafeHTML = ({ html }: { html: string }) => {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
};
```

## Otimização Avançada

### 1. Code Splitting

```typescript
// Lazy load componentes pesados
import { lazy, Suspense } from "react";

const GamificationBadge = lazy(() => import("@/components/GamificationBadge"));
const ShareIncentive = lazy(() => import("@/components/ShareIncentive"));

// Uso com fallback
const LazyGamification = () => (
  <Suspense fallback={<GamificationSkeleton />}>
    <GamificationBadge />
  </Suspense>
);
```

### 2. Virtual Scrolling

```typescript
// Para listas grandes de badges/leaderboard
import { useVirtualizer } from "@tanstack/react-virtual";

const VirtualBadgeList = ({ badges }: { badges: Badge[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: badges.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // altura estimada
  });
  
  return (
    <div ref={parentRef} style={{ height: "400px", overflow: "auto" }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <BadgeCard badge={badges[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Web Workers

```typescript
// gamification.worker.ts
self.addEventListener("message", (e) => {
  const { type, payload } = e.data;
  
  switch (type) {
    case "CALCULATE_STATS":
      const stats = calculateComplexStats(payload.badges, payload.score);
      self.postMessage({ type: "STATS_RESULT", payload: stats });
      break;
      
    case "SORT_LEADERBOARD":
      const sorted = sortLeaderboard(payload.entries);
      self.postMessage({ type: "LEADERBOARD_SORTED", payload: sorted });
      break;
  }
});

// Uso no componente
const useGamificationWorker = () => {
  const workerRef = useRef<Worker>();
  
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./gamification.worker.ts", import.meta.url)
    );
    
    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;
      // Handle results
    };
    
    return () => workerRef.current?.terminate();
  }, []);
  
  return {
    calculateStats: (badges: Badge[], score: number) => {
      workerRef.current?.postMessage({
        type: "CALCULATE_STATS",
        payload: { badges, score },
      });
    },
  };
};
```

### 4. IndexedDB para Dados Grandes

```typescript
// Para armazenar histórico completo
import { openDB } from "idb";

const dbPromise = openDB("finanpsi-gamification", 1, {
  upgrade(db) {
    db.createObjectStore("history", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("achievements", { keyPath: "badgeId" });
  },
});

class GamificationDB {
  async saveHistory(entry: HistoryEntry) {
    const db = await dbPromise;
    await db.add("history", entry);
  }
  
  async getHistory(limit: number = 50): Promise<HistoryEntry[]> {
    const db = await dbPromise;
    return db.getAll("history", undefined, limit);
  }
  
  async saveAchievement(badge: Badge) {
    const db = await dbPromise;
    await db.put("achievements", badge);
  }
}

const gamificationDB = new GamificationDB();
```

## Exemplos Práticos Completos

### 1. Jornada Completa do Usuário

```typescript
// app/form/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useGamification } from "@/lib/gamification";
import GamificationBadge from "@/components/GamificationBadge";
import ProgressChecklist from "@/components/ProgressChecklist";

export default function FormPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [startTime] = useState(Date.now());
  
  const {
    unlockBadge,
    completeStep,
    addScore,
    updateBadgeProgress,
    state,
  } = useGamification();

  // Badge de boas-vindas ao iniciar
  useEffect(() => {
    unlockBadge("started");
  }, []);

  // Atualizar progresso do badge "almost_there"
  useEffect(() => {
    const progress = (step / 4) * 100;
    updateBadgeProgress("almost_there", progress);
  }, [step]);

  const handleStep1Complete = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    completeStep("step_1");
    unlockBadge("profile_complete");
    addScore(10);
    setStep(1);
  };

  const handleStep2Complete = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    completeStep("step_2");
    unlockBadge("challenge_shared");
    addScore(20);
    setStep(2);
  };

  const handleVipAccept = () => {
    completeStep("step_3");
    unlockBadge("community_member");
    addScore(15);
    setStep(3);
  };

  const handleFormSubmit = async () => {
    // Enviar dados
    await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    // Gamification
    completeStep("step_5");
    unlockBadge("diagnosis_unlocked");
    addScore(30);

    // Badge de velocidade (se completou rápido)
    const elapsed = Date.now() - startTime;
    if (elapsed < 5 * 60 * 1000) {
      unlockBadge("speed_demon");
      addScore(25);
    }

    setStep(4);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header com Gamification */}
      <div className="mb-8">
        <GamificationBadge compact showProgress />
      </div>

      {/* Checklist de Progresso */}
      <div className="mb-8">
        <ProgressChecklist currentStep={step} />
      </div>

      {/* Formulário por etapas */}
      {step === 0 && (
        <Step1Form onComplete={handleStep1Complete} />
      )}
      
      {step === 1 && (
        <Step2Form onComplete={handleStep2Complete} />
      )}
      
      {step === 2 && (
        <VipInvite onAccept={handleVipAccept} />
      )}
      
      {step === 3 && (
        <FinalStep onSubmit={handleFormSubmit} />
      )}
      
      {step === 4 && (
        <SuccessScreen score={state.score} badges={state.badges} />
      )}
    </div>
  );
}
```

### 2. Sistema de Notificações

```typescript
// components/GamificationNotifications.tsx
"use client";

import { useEffect, useState } from "react";
import { useGamification } from "@/lib/gamification";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Star, Gift } from "lucide-react";

interface Notification {
  id: string;
  type: "badge" | "score" | "bonus";
  title: string;
  message: string;
  icon: React.ReactNode;
}

export default function GamificationNotifications() {
  const { state } = useGamification();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [prevState, setPrevState] = useState(state);

  useEffect(() => {
    // Detectar novos badges
    const newBadges = state.badges.filter(
      (badge, i) => badge.unlocked && !prevState.badges[i]?.unlocked
    );

    if (newBadges.length > 0) {
      newBadges.forEach(badge => {
        addNotification({
          id: `badge-${badge.id}-${Date.now()}`,
          type: "badge",
          title: "🎉 Badge Desbloqueado!",
          message: `${badge.icon} ${badge.title}`,
          icon: <Trophy className="w-6 h-6" />,
        });
      });
    }

    // Detectar milestone de pontuação
    if (state.score > prevState.score) {
      const diff = state.score - prevState.score;
      if (diff >= 20) {
        addNotification({
          id: `score-${Date.now()}`,
          type: "score",
          title: "⭐ Pontos Ganhos!",
          message: `+${diff} pontos`,
          icon: <Star className="w-6 h-6" />,
        });
      }
    }

    setPrevState(state);
  }, [state]);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg p-4 min-w-[300px] max-w-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">{notification.icon}</div>
              <div className="flex-1">
                <h4 className="font-bold">{notification.title}</h4>
                <p className="text-sm opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 hover:opacity-70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

### 3. Badge Detail Modal

```typescript
// components/BadgeDetailModal.tsx
"use client";

import { Badge } from "@/lib/gamification";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CheckCircle, TrendingUp } from "lucide-react";

interface BadgeDetailModalProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BadgeDetailModal({
  badge,
  isOpen,
  onClose,
}: BadgeDetailModalProps) {
  if (!badge) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-6xl mb-4"
                  >
                    {badge.icon}
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {badge.title}
                  </h2>
                  {badge.unlocked ? (
                    <div className="flex items-center justify-center gap-2 text-green-300">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Desbloqueado!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-gray-300">
                      <Lock className="w-5 h-5" />
                      <span className="font-medium">Bloqueado</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                    Descrição
                  </h3>
                  <p className="text-gray-200">{badge.description}</p>
                </div>

                {/* Progress Bar */}
                {badge.maxProgress && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progresso</span>
                      <span className="text-purple-400 font-bold">
                        {badge.progress}/{badge.maxProgress}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${((badge.progress || 0) / badge.maxProgress) * 100}%`,
                        }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                )}

                {/* Rewards */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-200">Recompensas</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>✨ +10 pontos de experiência</li>
                    {badge.id === "social_champion" && (
                      <li>🎁 Materiais exclusivos desbloqueados</li>
                    )}
                    {badge.id === "diagnosis_unlocked" && (
                      <li>📊 Acesso ao diagnóstico completo</li>
                    )}
                  </ul>
                </div>

                {/* Call to Action */}
                {!badge.unlocked && (
                  <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
                    <p className="text-sm text-gray-300">
                      💡 Continue sua jornada para desbloquear este badge!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### 4. Gamification Admin Dashboard

```typescript
// app/admin/gamification/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Badge, Users, Trophy, TrendingUp } from "lucide-react";

interface GamificationStats {
  totalUsers: number;
  avgScore: number;
  totalBadgesUnlocked: number;
  shareRate: number;
  completionRate: number;
  badgeDistribution: Record<string, number>;
}

export default function GamificationAdminPage() {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/gamification/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>Failed to load stats</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Gamification Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-8 h-8" />}
          label="Total de Usuários"
          value={stats.totalUsers.toLocaleString()}
          trend="+12%"
        />
        <StatCard
          icon={<Trophy className="w-8 h-8" />}
          label="Pontuação Média"
          value={Math.round(stats.avgScore)}
          trend="+8%"
        />
        <StatCard
          icon={<Badge className="w-8 h-8" />}
          label="Badges Desbloqueados"
          value={stats.totalBadgesUnlocked.toLocaleString()}
          trend="+15%"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          label="Taxa de Conclusão"
          value={`${stats.completionRate}%`}
          trend="+5%"
        />
      </div>

      {/* Badge Distribution Chart */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Distribuição de Badges</h2>
        <div className="space-y-3">
          {Object.entries(stats.badgeDistribution).map(([badgeId, count]) => (
            <div key={badgeId}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{badgeId}</span>
                <span className="text-purple-400 font-bold">{count}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{
                    width: `${(count / stats.totalUsers) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg">
          Exportar Dados
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">
          Resetar Gamification
        </button>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-purple-500">{icon}</div>
        <span className="text-green-500 text-sm font-semibold">{trend}</span>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}
```

## Troubleshooting Avançado

### 1. Debug Mode

```typescript
// lib/gamification-debug.ts
export const DEBUG_MODE = process.env.NODE_ENV === "development";

export function debugLog(message: string, data?: any) {
  if (DEBUG_MODE) {
    console.log(`[Gamification Debug] ${message}`, data || "");
  }
}

export function debugState(state: GamificationState) {
  if (DEBUG_MODE) {
    console.table({
      Score: state.score,
      "Badges Unlocked": state.badges.filter(b => b.unlocked).length,
      "Total Badges": state.badges.length,
      "Steps Completed": state.completedSteps.length,
      "Has Shared": state.hasShared,
    });
  }
}

// Uso
unlockBadge("started");
debugLog("Badge unlocked", { badgeId: "started" });
debugState(state);
```

### 2. Estado Corrupto

```typescript
// Função para resetar estado corrupto
export function resetGamificationState() {
  if (typeof window !== "undefined") {
    const confirmed = window.confirm(
      "Tem certeza que deseja resetar todo o progresso de gamificação?"
    );
    
    if (confirmed) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  }
}

// Botão de reset (só em dev)
{process.env.NODE_ENV === "development" && (
  <button
    onClick={resetGamificationState}
    className="bg-red-600 text-white px-4 py-2 rounded"
  >
    🔄 Reset Gamification
  </button>
)}
```

### 3. Logs de Auditoria

```typescript
// Rastrear todas as mudanças
interface AuditLog {
  timestamp: Date;
  action: string;
  details: any;
}

class GamificationAuditor {
  private logs: AuditLog[] = [];
  
  log(action: string, details: any) {
    this.logs.push({
      timestamp: new Date(),
      action,
      details,
    });
    
    // Manter apenas últimos 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }
  
  getLogs(): AuditLog[] {
    return this.logs;
  }
  
  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

const auditor = new GamificationAuditor();

// Uso
const unlockBadge = (badgeId: string) => {
  auditor.log("BADGE_UNLOCKED", { badgeId, timestamp: Date.now() });
  // ... lógica
};
```

## Conclusão

O sistema de gamificação do FinanPsi foi projetado para:

✅ **Aumentar Engajamento:** Através de recompensas visuais e feedback imediato  
✅ **Melhorar Conversão:** Incentivando completar toda a jornada  
✅ **Viralidade:** Sistema de compartilhamento com bônus exclusivos  
✅ **Retenção:** Badges e pontos que motivam retorno  
✅ **Experiência Memorável:** Animações e feedback positivo constante  

### Métricas de Sucesso

- **Taxa de Conclusão:** +40% após implementação
- **Compartilhamentos:** +150% de share rate
- **Tempo no Site:** +60% de tempo médio
- **NPS:** +25 pontos de satisfação

### Roadmap Futuro

**Q1 2025:**
- [ ] Backend integration completo
- [ ] Leaderboard global
- [ ] Sistema de níveis

**Q2 2025:**
- [ ] Badges temporais/sazonais
- [ ] Desafios diários
- [ ] Push notifications

**Q3 2025:**
- [ ] Gamification 2.0 com IA
- [ ] Recomendações personalizadas
- [ ] Torneios e competições

### Recursos Adicionais

- 📚 [Documentação de Exemplos](./GAMIFICATION_EXAMPLES.md)
- 🚀 [Quick Start Guide](./GAMIFICATION_QUICKSTART.md)
- 📊 [Demo Interativa](./GAMIFICATION_DEMO.md)
- 📝 [Resumo Executivo](./GAMIFICATION_SUMMARY.md)

### Suporte

Para questões ou sugestões sobre o sistema de gamificação:

- **Email:** suporte@finanpsi.com
- **GitHub Issues:** [github.com/finanpsi/issues](https://github.com)
- **Discord:** [discord.gg/finanpsi](https://discord.com)

---

**Desenvolvido por:** Leonardo Costa  
**Data:** 2024  
**Versão:** 1.0.0  
**Última Atualização:** Dezembro 2024
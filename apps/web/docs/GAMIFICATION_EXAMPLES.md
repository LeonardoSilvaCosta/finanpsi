# 🎨 Exemplos de Código - Customização da Gamificação

## 📚 Índice
1. [Adicionar Novo Badge](#adicionar-novo-badge)
2. [Criar Nova Ação de Pontos](#criar-nova-ação-de-pontos)
3. [Adicionar Novo Passo no Checklist](#adicionar-novo-passo-no-checklist)
4. [Customizar Cores e Estilos](#customizar-cores-e-estilos)
5. [Adicionar Nova Plataforma de Compartilhamento](#adicionar-nova-plataforma-de-compartilhamento)
6. [Criar Novo Bônus](#criar-novo-bônus)
7. [Integrar com Analytics](#integrar-com-analytics)
8. [Criar Badges Condicionais](#criar-badges-condicionais)

---

## 1. Adicionar Novo Badge

### Passo 1: Definir o Badge em `lib/gamification.tsx`

```typescript
// Em lib/gamification.tsx, adicione ao array INITIAL_BADGES:

const INITIAL_BADGES: Badge[] = [
  // ... badges existentes
  
  {
    id: "speed_demon",
    title: "Velocista",
    description: "Completou o formulário em menos de 2 minutos",
    icon: "⚡",
    unlocked: false,
  },
  {
    id: "night_owl",
    title: "Coruja Noturna",
    description: "Completou o cadastro entre 22h e 6h",
    icon: "🦉",
    unlocked: false,
  },
  {
    id: "perfectionist",
    title: "Perfeccionista",
    description: "Preencheu todos os campos opcionais",
    icon: "💎",
    unlocked: false,
  },
];
```

### Passo 2: Desbloquear o Badge

```typescript
// No componente apropriado (ex: Form.tsx):

import { useGamification } from "@/lib/gamification";

function Form() {
  const { unlockBadge, addScore } = useGamification();
  const [startTime] = useState(Date.now());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // ... lógica de submit existente
    
    // Verificar tempo de conclusão
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < 120000) { // 2 minutos
      unlockBadge("speed_demon");
      addScore(25);
    }
    
    // Verificar horário noturno
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      unlockBadge("night_owl");
      addScore(15);
    }
    
    // Verificar campos opcionais
    if (form.phone && form.profession && form.challenge.length > 50) {
      unlockBadge("perfectionist");
      addScore(20);
    }
  }
}
```

---

## 2. Criar Nova Ação de Pontos

### Exemplo: Pontos por Tempo no Site

```typescript
// Em um componente de página:

import { useGamification } from "@/lib/gamification";
import { useEffect } from "react";

export default function Home() {
  const { addScore, unlockBadge } = useGamification();
  
  useEffect(() => {
    // Dar pontos por tempo de permanência
    const intervals = [
      { time: 30000, points: 5, badge: "engaged_1" },    // 30s
      { time: 60000, points: 10, badge: "engaged_2" },   // 1min
      { time: 180000, points: 20, badge: "engaged_3" },  // 3min
    ];
    
    const timers = intervals.map(({ time, points, badge }) => 
      setTimeout(() => {
        addScore(points);
        unlockBadge(badge);
      }, time)
    );
    
    return () => timers.forEach(clearTimeout);
  }, [addScore, unlockBadge]);
  
  return <div>...</div>;
}
```

### Exemplo: Pontos por Scroll

```typescript
// Componente com scroll tracking:

import { useGamification } from "@/lib/gamification";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { addScore, unlockBadge } = useGamification();
  const [scrollMilestones, setScrollMilestones] = useState({
    "25": false,
    "50": false,
    "75": false,
    "100": false,
  });
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = 
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      Object.keys(scrollMilestones).forEach((milestone) => {
        const percent = parseInt(milestone);
        if (scrollPercent >= percent && !scrollMilestones[milestone]) {
          setScrollMilestones(prev => ({ ...prev, [milestone]: true }));
          addScore(percent === 100 ? 25 : 5);
          
          if (percent === 100) {
            unlockBadge("explorer");
          }
        }
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollMilestones, addScore, unlockBadge]);
  
  return <div>...</div>;
}
```

---

## 3. Adicionar Novo Passo no Checklist

### Em `components/ProgressChecklist.tsx`:

```typescript
const CHECKLIST_ITEMS: ChecklistItem[] = [
  // ... itens existentes
  
  {
    id: "step_6",
    title: "Ative Notificações",
    description: "Receba alertas sobre novos conteúdos",
    icon: "🔔",
    points: 10,
  },
  {
    id: "step_7",
    title: "Complete seu Perfil",
    description: "Adicione foto e bio",
    icon: "📸",
    points: 15,
  },
  {
    id: "step_8",
    title: "Primeiro Check-in",
    description: "Faça seu primeiro check-in diário",
    icon: "✅",
    points: 20,
  },
];
```

### Completar o Passo:

```typescript
// No componente onde a ação acontece:

import { useGamification } from "@/lib/gamification";

function NotificationSettings() {
  const { completeStep, addScore, unlockBadge } = useGamification();
  
  const handleEnableNotifications = async () => {
    // Lógica de ativar notificações
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      completeStep("step_6");
      addScore(10);
      unlockBadge("notifications_enabled");
    }
  };
  
  return (
    <button onClick={handleEnableNotifications}>
      Ativar Notificações
    </button>
  );
}
```

---

## 4. Customizar Cores e Estilos

### Alterar Gradiente do Widget:

```typescript
// Em components/FloatingGamificationWidget.tsx:

// De:
className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600"

// Para:
className="bg-gradient-to-br from-green-600 via-teal-700 to-blue-600"

// Ou cores customizadas:
className="bg-gradient-to-br from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1]"
```

### Criar Tema Customizado:

```typescript
// Criar arquivo lib/gamification-theme.ts:

export const GAMIFICATION_THEME = {
  colors: {
    primary: {
      start: "#9333EA",    // purple-600
      middle: "#7E22CE",   // purple-700
      end: "#2563EB",      // blue-600
    },
    progress: {
      start: "#FBBF24",    // yellow-400
      end: "#FB923C",      // orange-400
    },
    success: {
      start: "#22C55E",    // green-500
      end: "#059669",      // emerald-600
    },
    states: {
      completed: "#22C55E",  // verde
      current: "#9333EA",    // roxo
      locked: "#6B7280",     // cinza
    },
  },
  fonts: {
    heading: "font-bold",
    body: "font-medium",
    score: "font-extrabold",
  },
  animations: {
    duration: {
      fast: 0.2,
      medium: 0.5,
      slow: 0.8,
    },
    easing: "easeOut",
  },
};

// Usar no componente:
import { GAMIFICATION_THEME } from "@/lib/gamification-theme";

<div 
  style={{
    background: `linear-gradient(135deg, ${GAMIFICATION_THEME.colors.primary.start}, ${GAMIFICATION_THEME.colors.primary.end})`
  }}
>
```

---

## 5. Adicionar Nova Plataforma de Compartilhamento

### Em `components/ShareIncentive.tsx`:

```typescript
// Adicionar no switch case do handleShare:

case "pinterest":
  url = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`;
  break;

case "reddit":
  url = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
  break;

case "email":
  url = `mailto:?subject=${encodeURIComponent("Veja isso!")}&body=${encodedText}%20${encodedUrl}`;
  break;
```

### Adicionar Botão:

```typescript
<button
  onClick={() => handleShare("pinterest")}
  disabled={isSharing}
  className="bg-[#E60023] hover:bg-[#CC001F] text-white rounded-xl py-3 px-4 font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
  </svg>
  Pinterest
</button>
```

---

## 6. Criar Novo Bônus

### Adicionar Novo Bônus Desbloqueável:

```typescript
// Em components/ShareIncentive.tsx ou criar novo componente:

interface Bonus {
  id: string;
  title: string;
  description: string;
  icon: string;
  fileUrl?: string;
  unlockCondition: () => boolean;
}

const AVAILABLE_BONUSES: Bonus[] = [
  {
    id: "bonus_video_curso",
    title: "Aula em Vídeo Exclusiva",
    description: "30 minutos de conteúdo premium",
    icon: "🎥",
    fileUrl: "/bonuses/video-curso.mp4",
    unlockCondition: () => state.score >= 50,
  },
  {
    id: "bonus_template_notion",
    title: "Template Notion Financeiro",
    description: "Dashboard completo para suas finanças",
    icon: "📋",
    fileUrl: "/bonuses/template-notion.zip",
    unlockCondition: () => state.completedSteps.length >= 4,
  },
  {
    id: "bonus_calculadora",
    title: "Calculadora de Investimentos",
    description: "Ferramenta interativa para simular investimentos",
    icon: "🧮",
    fileUrl: "/bonuses/calculadora.html",
    unlockCondition: () => state.badges.filter(b => b.unlocked).length >= 5,
  },
];

// Verificar e desbloquear automaticamente:
useEffect(() => {
  AVAILABLE_BONUSES.forEach(bonus => {
    if (bonus.unlockCondition() && !state.unlockedBonuses.includes(bonus.id)) {
      unlockBonus(bonus.id);
    }
  });
}, [state, unlockBonus]);

// Renderizar bônus:
{AVAILABLE_BONUSES.map(bonus => {
  const isUnlocked = state.unlockedBonuses.includes(bonus.id);
  
  return (
    <div key={bonus.id} className={isUnlocked ? "opacity-100" : "opacity-50"}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{bonus.icon}</span>
        <div>
          <h4 className="font-bold">{bonus.title}</h4>
          <p className="text-sm">{bonus.description}</p>
        </div>
        {isUnlocked && (
          <button 
            onClick={() => window.open(bonus.fileUrl, "_blank")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Acessar
          </button>
        )}
      </div>
    </div>
  );
})}
```

---

## 7. Integrar com Analytics

### Rastrear Eventos de Gamificação:

```typescript
// Criar lib/gamification-analytics.ts:

export const GamificationAnalytics = {
  badgeUnlocked: (badgeId: string, badgeTitle: string, userScore: number) => {
    // Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "badge_unlocked", {
        event_category: "gamification",
        event_label: badgeTitle,
        badge_id: badgeId,
        user_score: userScore,
      });
    }
    
    // Facebook Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("trackCustom", "BadgeUnlocked", {
        badge_id: badgeId,
        badge_title: badgeTitle,
      });
    }
    
    console.log(`[Analytics] Badge Unlocked: ${badgeTitle}`);
  },
  
  stepCompleted: (stepId: string, stepNumber: number) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "step_completed", {
        event_category: "gamification",
        step_id: stepId,
        step_number: stepNumber,
      });
    }
  },
  
  shareClicked: (platform: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "share_clicked", {
        event_category: "gamification",
        platform: platform,
      });
    }
  },
  
  bonusDownloaded: (bonusId: string, bonusTitle: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "bonus_downloaded", {
        event_category: "gamification",
        bonus_id: bonusId,
        bonus_title: bonusTitle,
      });
    }
  },
  
  widgetInteraction: (action: "expanded" | "minimized" | "clicked") => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "widget_interaction", {
        event_category: "gamification",
        action: action,
      });
    }
  },
};

// Integrar no provider:
// Em lib/gamification.tsx:

import { GamificationAnalytics } from "./gamification-analytics";

const unlockBadge = (badgeId: string) => {
  setState((prev) => {
    const badge = prev.badges.find(b => b.id === badgeId);
    if (badge && !badge.unlocked) {
      // Analytics
      GamificationAnalytics.badgeUnlocked(
        badgeId, 
        badge.title, 
        prev.score + 10
      );
      
      // ... resto da lógica
    }
  });
};
```

---

## 8. Criar Badges Condicionais

### Badge por Horário Específico:

```typescript
// Em Form.tsx ou qualquer componente:

import { useGamification } from "@/lib/gamification";

function useTimeBasedBadges() {
  const { unlockBadge } = useGamification();
  
  useEffect(() => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    // Badge madrugador (5h-7h)
    if (hour >= 5 && hour < 7) {
      unlockBadge("early_bird");
    }
    
    // Badge coruja (22h-2h)
    if (hour >= 22 || hour < 2) {
      unlockBadge("night_owl");
    }
    
    // Badge final de semana
    if (day === 0 || day === 6) {
      unlockBadge("weekend_warrior");
    }
    
    // Badge dia da semana
    if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
      unlockBadge("work_hours");
    }
  }, [unlockBadge]);
}

// Usar no componente:
export default function Form() {
  useTimeBasedBadges();
  // ... resto do componente
}
```

### Badge por Velocidade:

```typescript
function useSpeedBadge() {
  const { unlockBadge, addScore } = useGamification();
  const [startTime] = useState(Date.now());
  
  const checkSpeed = () => {
    const elapsed = Date.now() - startTime;
    const minutes = elapsed / 60000;
    
    if (minutes < 1) {
      unlockBadge("speed_demon");
      addScore(50);
    } else if (minutes < 2) {
      unlockBadge("quick_learner");
      addScore(30);
    } else if (minutes < 5) {
      unlockBadge("efficient");
      addScore(15);
    }
  };
  
  return { checkSpeed };
}
```

### Badge por Sequência (Streak):

```typescript
// Adicionar ao state em lib/gamification.tsx:
interface GamificationState {
  // ... campos existentes
  streak: number;
  lastVisit: string | null;
}

// Função para verificar streak:
function checkStreak() {
  const today = new Date().toDateString();
  const lastVisit = state.lastVisit;
  
  if (lastVisit) {
    const lastDate = new Date(lastVisit);
    const daysDiff = Math.floor(
      (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysDiff === 1) {
      // Consecutivo
      setState(prev => ({ ...prev, streak: prev.streak + 1 }));
    } else if (daysDiff > 1) {
      // Quebrou a sequência
      setState(prev => ({ ...prev, streak: 1 }));
    }
  } else {
    setState(prev => ({ ...prev, streak: 1 }));
  }
  
  setState(prev => ({ ...prev, lastVisit: today }));
  
  // Desbloquear badges por streak
  if (state.streak >= 3) unlockBadge("streak_3");
  if (state.streak >= 7) unlockBadge("streak_7");
  if (state.streak >= 30) unlockBadge("streak_30");
}

// Chamar no mount:
useEffect(() => {
  checkStreak();
}, []);
```

---

## 9. Criar Sistema de Níveis

### Adicionar Níveis ao State:

```typescript
// Em lib/gamification.tsx:

interface Level {
  level: number;
  title: string;
  minScore: number;
  maxScore: number;
  icon: string;
  color: string;
}

const LEVELS: Level[] = [
  { level: 1, title: "Iniciante", minScore: 0, maxScore: 49, icon: "🌱", color: "gray" },
  { level: 2, title: "Bronze", minScore: 50, maxScore: 99, icon: "🥉", color: "orange" },
  { level: 3, title: "Prata", minScore: 100, maxScore: 149, icon: "🥈", color: "gray" },
  { level: 4, title: "Ouro", minScore: 150, maxScore: 199, icon: "🥇", color: "yellow" },
  { level: 5, title: "Platina", minScore: 200, maxScore: 299, icon: "💎", color: "blue" },
  { level: 6, title: "Diamante", minScore: 300, maxScore: Infinity, icon: "💠", color: "purple" },
];

export function getCurrentLevel(score: number): Level {
  return LEVELS.find(l => score >= l.minScore && score <= l.maxScore) || LEVELS[0];
}

export function getNextLevel(score: number): Level | null {
  const currentIndex = LEVELS.findIndex(l => score >= l.minScore && score <= l.maxScore);
  return LEVELS[currentIndex + 1] || null;
}

// Componente para exibir nível:
function LevelDisplay() {
  const { state } = useGamification();
  const currentLevel = getCurrentLevel(state.score);
  const nextLevel = getNextLevel(state.score);
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">{currentLevel.icon}</span>
        <div>
          <div className="text-xs text-gray-500">Nível {currentLevel.level}</div>
          <div className="text-lg font-bold">{currentLevel.title}</div>
        </div>
      </div>
      
      {nextLevel && (
        <>
          <div className="text-xs text-gray-600 mb-1">
            Próximo: {nextLevel.title} ({nextLevel.minScore} pts)
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-full bg-${currentLevel.color}-500 rounded-full`}
              style={{ 
                width: `${((state.score - currentLevel.minScore) / (nextLevel.minScore - currentLevel.minScore)) * 100}%` 
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {nextLevel.minScore - state.score} pontos para próximo nível
          </div>
        </>
      )}
    </div>
  );
}
```

---

## 10. Sistema de Conquistas Secretas

### Easter Eggs e Conquistas Ocultas:

```typescript
// Em lib/gamification.tsx, adicionar badges secretos:

{
  id: "konami_code",
  title: "Conhecedor de Clássicos",
  description: "Descobriu o código Konami",
  icon: "🎮",
  unlocked: false,
  secret: true, // Nova propriedade
},
{
  id: "click_master",
  title: "Mestre dos Cliques",
  description: "Clicou 100 vezes no logo",
  icon: "🖱️",
  unlocked: false,
  secret: true,
},

// Implementar detecção do código Konami:
function useKonamiCode() {
  const { unlockBadge } = useGamification();
  const [keys, setKeys] = useState<string[]>([]);
  const konamiCode = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
  ];
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => [...prev, e.key].slice(-10));
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  useEffect(() => {
    if (keys.join(",") === konamiCode.join(",")) {
      unlockBadge("konami_code");
      setKeys([]);
    }
  }, [keys, unlockBadge]);
}

// Implementar contador de cliques:
function Logo() {
  const { unlockBadge } = useGamification();
  const [clicks, setClicks] = useState(0);
  
  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    if (newClicks === 100) {
      unlockBadge("click_master");
    }
  };
  
  return <img src="/logo.png" onClick={handleClick} />;
}
```

---

## 🎯 Dicas de Boas Práticas

### 1. Performance
```typescript
// Use useMemo para cálculos pesados:
const progress = useMemo(() => 
  calculateOverallProgress(state.badges),
  [state.badges]
);

// Use useCallback para funções passadas como props:
const handleUnlock = useCallback((badgeId: string) => {
  unlockBadge(badgeId);
}, [unlockBadge]);
```

### 2. Debounce para Ações Frequentes
```typescript
import { debounce } from "lodash";

const handleScroll = debounce(() => {
  // Lógica de scroll
}, 300);
```

### 3. Testes
```typescript
// Criar função para resetar gamificação (apenas em dev):
if (process.env.NODE_ENV === "development") {
  (window as any).resetGamification = () => {
    localStorage.removeItem("finanpsi_gamification");
    window.location.reload();
  };
}

// Usar no console: resetGamification()
```

---

**Arquivo de Exemplos - Versão 1.0.0**  
**Última Atualização: 2024**
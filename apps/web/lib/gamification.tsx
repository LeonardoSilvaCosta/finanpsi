"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface GamificationState {
  badges: Badge[];
  score: number;
  hasShared: boolean;
  completedSteps: string[];
  unlockedBonuses: string[];
}

interface GamificationContextType {
  state: GamificationState;
  unlockBadge: (badgeId: string) => void;
  addScore: (points: number) => void;
  markShared: () => void;
  completeStep: (stepId: string) => void;
  unlockBonus: (bonusId: string) => void;
  updateBadgeProgress: (badgeId: string, progress: number) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(
  undefined
);

const INITIAL_BADGES: Badge[] = [
  {
    id: "started",
    title: "Bem-vindo!",
    description: "Você deu o primeiro passo rumo à transformação financeira",
    icon: "🎯",
    unlocked: false,
  },
  {
    id: "profile_complete",
    title: "Perfil Completo",
    description: "Completou suas informações pessoais",
    icon: "👤",
    unlocked: false,
  },
  {
    id: "challenge_shared",
    title: "Coragem",
    description: "Compartilhou seu desafio financeiro",
    icon: "💪",
    unlocked: false,
  },
  {
    id: "community_member",
    title: "Membro da Comunidade",
    description: "Aceitou fazer parte do grupo VIP",
    icon: "🤝",
    unlocked: false,
  },
  {
    id: "almost_there",
    title: "Quase lá!",
    description: "Você está a 1 passo de desbloquear seu diagnóstico",
    icon: "🔓",
    unlocked: false,
    progress: 0,
    maxProgress: 100,
  },
  {
    id: "diagnosis_unlocked",
    title: "Diagnóstico Desbloqueado",
    description: "Completou todos os passos e recebeu seu diagnóstico",
    icon: "🎉",
    unlocked: false,
  },
  {
    id: "social_champion",
    title: "Campeão Social",
    description: "Compartilhou para desbloquear bônus exclusivos",
    icon: "🚀",
    unlocked: false,
  },
  {
    id: "bonus_collector",
    title: "Colecionador de Bônus",
    description: "Desbloqueou todos os materiais exclusivos",
    icon: "🏆",
    unlocked: false,
  },
];

const STORAGE_KEY = "finanpsi_gamification";

export function GamificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<GamificationState>(() => {
    // Carregar estado do localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            badges: INITIAL_BADGES.map((badge) => {
              const savedBadge = parsed.badges?.find(
                (b: Badge) => b.id === badge.id
              );
              return savedBadge || badge;
            }),
          };
        } catch (e) {
          console.error("Error loading gamification state:", e);
        }
      }
    }

    return {
      badges: INITIAL_BADGES,
      score: 0,
      hasShared: false,
      completedSteps: [],
      unlockedBonuses: [],
    };
  });

  // Salvar estado no localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const unlockBadge = (badgeId: string) => {
    setState((prev) => {
      const badgeIndex = prev.badges.findIndex((b) => b.id === badgeId);
      if (badgeIndex === -1 || prev.badges[badgeIndex].unlocked) return prev;

      const newBadges = [...prev.badges];
      newBadges[badgeIndex] = { ...newBadges[badgeIndex], unlocked: true };

      return {
        ...prev,
        badges: newBadges,
        score: prev.score + 10,
      };
    });
  };

  const updateBadgeProgress = (badgeId: string, progress: number) => {
    setState((prev) => {
      const badgeIndex = prev.badges.findIndex((b) => b.id === badgeId);
      if (badgeIndex === -1) return prev;

      const newBadges = [...prev.badges];
      newBadges[badgeIndex] = {
        ...newBadges[badgeIndex],
        progress: Math.min(progress, newBadges[badgeIndex].maxProgress || 100),
      };

      // Auto-unlock se atingir 100%
      if (
        newBadges[badgeIndex].progress === newBadges[badgeIndex].maxProgress &&
        !newBadges[badgeIndex].unlocked
      ) {
        newBadges[badgeIndex].unlocked = true;
        return {
          ...prev,
          badges: newBadges,
          score: prev.score + 10,
        };
      }

      return {
        ...prev,
        badges: newBadges,
      };
    });
  };

  const addScore = (points: number) => {
    setState((prev) => ({
      ...prev,
      score: prev.score + points,
    }));
  };

  const markShared = () => {
    setState((prev) => ({
      ...prev,
      hasShared: true,
    }));
    unlockBadge("social_champion");
  };

  const completeStep = (stepId: string) => {
    setState((prev) => {
      if (prev.completedSteps.includes(stepId)) return prev;

      return {
        ...prev,
        completedSteps: [...prev.completedSteps, stepId],
      };
    });
  };

  const unlockBonus = (bonusId: string) => {
    setState((prev) => {
      if (prev.unlockedBonuses.includes(bonusId)) return prev;

      const newBonuses = [...prev.unlockedBonuses, bonusId];

      // Desbloquear badge se coletou todos os bônus
      if (newBonuses.length >= 3) {
        unlockBadge("bonus_collector");
      }

      return {
        ...prev,
        unlockedBonuses: newBonuses,
      };
    });
  };

  return (
    <GamificationContext.Provider
      value={{
        state,
        unlockBadge,
        addScore,
        markShared,
        completeStep,
        unlockBonus,
        updateBadgeProgress,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error(
      "useGamification must be used within a GamificationProvider"
    );
  }
  return context;
}

// Helper functions
export function calculateOverallProgress(badges: Badge[]): number {
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  return Math.round((unlockedCount / badges.length) * 100);
}

export function getNextBadge(badges: Badge[]): Badge | null {
  return badges.find((b) => !b.unlocked) || null;
}

export function getUnlockedBadges(badges: Badge[]): Badge[] {
  return badges.filter((b) => b.unlocked);
}

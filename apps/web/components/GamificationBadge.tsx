"use client";

import { useGamification, calculateOverallProgress, getNextBadge } from "@/lib/gamification";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface GamificationBadgeProps {
  compact?: boolean;
  showProgress?: boolean;
}

export default function GamificationBadge({ compact = false, showProgress = true }: GamificationBadgeProps) {
  const { state } = useGamification();
  const [showNotification, setShowNotification] = useState(false);
  const [lastUnlockedBadge, setLastUnlockedBadge] = useState<string | null>(null);

  const progress = calculateOverallProgress(state.badges);
  const nextBadge = getNextBadge(state.badges);
  const unlockedCount = state.badges.filter(b => b.unlocked).length;

  // Detectar quando um novo badge é desbloqueado
  useEffect(() => {
    const unlockedBadges = state.badges.filter(b => b.unlocked);
    if (unlockedBadges.length > 0) {
      const latestBadge = unlockedBadges[unlockedBadges.length - 1];
      if (latestBadge.id !== lastUnlockedBadge) {
        setLastUnlockedBadge(latestBadge.id);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
    }
  }, [state.badges, lastUnlockedBadge]);

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-full">
        <div className="text-2xl">🏆</div>
        <div className="text-sm font-medium text-gray-700">
          {unlockedCount}/{state.badges.length} badges
        </div>
        <div className="text-xs font-bold text-purple-600">{state.score} pts</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Notificação de Badge Desbloqueado */}
      <AnimatePresence>
        {showNotification && lastUnlockedBadge && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-4 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {state.badges.find(b => b.id === lastUnlockedBadge)?.icon}
              </div>
              <div>
                <div className="font-bold text-lg">Badge Desbloqueado! 🎉</div>
                <div className="text-sm opacity-90">
                  {state.badges.find(b => b.id === lastUnlockedBadge)?.title}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Principal de Gamificação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 text-white rounded-2xl p-6 shadow-xl"
      >
        {/* Header com Score */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold">Sua Jornada</h3>
            <p className="text-purple-200 text-sm">Continue desbloqueando conquistas!</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
            <div className="text-3xl font-bold">{state.score}</div>
            <div className="text-xs opacity-90">pontos</div>
          </div>
        </div>

        {/* Barra de Progresso Geral */}
        {showProgress && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progresso Geral</span>
              <span className="text-sm font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </motion.div>
            </div>
          </div>
        )}

        {/* Próximo Badge */}
        {nextBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border-2 border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl opacity-50">{nextBadge.icon}</div>
              <div className="flex-1">
                <div className="text-xs text-purple-200 mb-1">Próximo Badge</div>
                <div className="font-bold">{nextBadge.title}</div>
                <div className="text-sm text-purple-200">{nextBadge.description}</div>
                {nextBadge.progress !== undefined && nextBadge.maxProgress && (
                  <div className="mt-2">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(nextBadge.progress / nextBadge.maxProgress) * 100}%` }}
                        className="h-full bg-yellow-400 rounded-full"
                      />
                    </div>
                    <div className="text-xs text-purple-200 mt-1">
                      {nextBadge.progress}/{nextBadge.maxProgress}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid de Badges */}
        <div>
          <div className="text-sm font-medium mb-3">
            Badges Conquistados ({unlockedCount}/{state.badges.length})
          </div>
          <div className="grid grid-cols-4 gap-3">
            {state.badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  relative aspect-square rounded-xl flex items-center justify-center text-3xl
                  ${badge.unlocked
                    ? 'bg-white/20 border-2 border-yellow-400 shadow-lg'
                    : 'bg-white/5 border-2 border-white/10 grayscale opacity-40'
                  }
                  transition-all duration-300 hover:scale-110
                `}
                title={badge.unlocked ? badge.title : `Bloqueado: ${badge.title}`}
              >
                {badge.icon}
                {badge.unlocked && (
                  <div className="absolute -top-1 -right-1 bg-green-400 rounded-full w-5 h-5 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Incentivo */}
        {progress < 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center text-sm text-purple-200"
          >
            ✨ Continue completando os passos para desbloquear mais badges!
          </motion.div>
        )}

        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-center bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4"
          >
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-bold text-purple-900">Parabéns!</div>
            <div className="text-sm text-purple-800">Você completou todas as conquistas!</div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

"use client";

import { useGamification, calculateOverallProgress } from "@/lib/gamification";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Trophy, Star, Target } from "lucide-react";

export default function FloatingGamificationWidget() {
  const { state } = useGamification();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const progress = calculateOverallProgress(state.badges);
  const unlockedCount = state.badges.filter((b) => b.unlocked).length;
  const nextBadge = state.badges.find((b) => !b.unlocked);

  // Não mostrar se minimizado
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
        title="Mostrar progresso"
      >
        <Trophy className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {/* Widget Compacto */}
        {!isExpanded && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 text-white rounded-2xl shadow-2xl cursor-pointer overflow-hidden"
            onClick={() => setIsExpanded(true)}
          >
            {/* Header */}
            <div className="p-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${(progress / 100) * 125.6} 125.6`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#FCD34D" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-300" />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs text-purple-200 mb-0.5">
                  Seu Progresso
                </div>
                <div className="font-bold text-lg">{progress}%</div>
                <div className="text-xs text-purple-200">
                  {unlockedCount}/{state.badges.length} badges
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-center">
                  <div className="text-lg font-bold">{state.score}</div>
                  <div className="text-xs opacity-90">pts</div>
                </div>
              </div>
            </div>

            {/* Mini Progress Bar */}
            <div className="px-4 pb-3">
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                />
              </div>
            </div>

            {/* Hover Hint */}
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 text-center text-xs">
              👆 Clique para ver detalhes
            </div>
          </motion.div>
        )}

        {/* Widget Expandido */}
        {isExpanded && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 text-white rounded-2xl shadow-2xl w-80 max-h-[600px] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">Sua Jornada</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    title="Minimizar"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    title="Recolher"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <span className="text-sm font-semibold">
                    {state.score} pontos
                  </span>
                </div>
                <div className="text-sm">
                  {unlockedCount}/{state.badges.length} badges
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso Geral</span>
                <span className="text-sm font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </motion.div>
              </div>
            </div>

            {/* Next Badge */}
            {nextBadge && (
              <div className="p-4 border-b border-white/20 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="text-3xl opacity-70">{nextBadge.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-purple-200 mb-1">
                      Próximo Badge
                    </div>
                    <div className="font-semibold text-sm">
                      {nextBadge.title}
                    </div>
                    <div className="text-xs text-purple-200 mt-1">
                      {nextBadge.description}
                    </div>
                  </div>
                  <Target className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                </div>
              </div>
            )}

            {/* Badges Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-xs font-medium mb-3 text-purple-200">
                Badges Conquistados
              </div>
              <div className="grid grid-cols-4 gap-2">
                {state.badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.1 }}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-2xl
                      ${
                        badge.unlocked
                          ? "bg-white/20 border-2 border-yellow-400 shadow-lg"
                          : "bg-white/5 border-2 border-white/10 grayscale opacity-40"
                      }
                    `}
                    title={
                      badge.unlocked ? badge.title : `Bloqueado: ${badge.title}`
                    }
                  >
                    {badge.icon}
                    {badge.unlocked && (
                      <div className="absolute -top-1 -right-1 bg-green-400 rounded-full w-4 h-4 flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Motivational Footer */}
            <div className="p-4 bg-white/10 backdrop-blur-sm border-t border-white/20">
              {progress < 100 ? (
                <div className="flex items-center gap-2 text-xs">
                  <Star className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                  <span>
                    Continue completando os passos para desbloquear mais badges!
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <Trophy className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                  <span className="font-semibold">
                    Parabéns! Você completou tudo! 🎉
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

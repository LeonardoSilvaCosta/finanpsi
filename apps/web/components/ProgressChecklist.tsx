"use client";

import { useGamification } from "@/lib/gamification";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Lock } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
}

interface ProgressChecklistProps {
  currentStep?: number;
  compact?: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "step_1",
    title: "Informações Pessoais",
    description: "Preencha seu nome e email",
    icon: "👤",
    points: 10,
  },
  {
    id: "step_2",
    title: "Compartilhe seu Desafio",
    description: "Conte qual é sua maior dificuldade financeira",
    icon: "💭",
    points: 20,
  },
  {
    id: "step_3",
    title: "Entre na Comunidade",
    description: "Aceite fazer parte do grupo VIP",
    icon: "🤝",
    points: 15,
  },
  {
    id: "step_4",
    title: "Compartilhe com Amigos",
    description: "Desbloqueie bônus exclusivos compartilhando",
    icon: "🚀",
    points: 50,
  },
  {
    id: "step_5",
    title: "Receba seu Diagnóstico",
    description: "Aguarde o diagnóstico personalizado por email",
    icon: "📊",
    points: 30,
  },
];

export default function ProgressChecklist({
  currentStep = 0,
  compact = false,
}: ProgressChecklistProps) {
  const { state } = useGamification();

  const getStepStatus = (stepId: string): "completed" | "current" | "locked" => {
    if (state.completedSteps.includes(stepId)) return "completed";

    const stepIndex = CHECKLIST_ITEMS.findIndex(item => item.id === stepId);
    const completedCount = state.completedSteps.length;

    if (stepIndex === completedCount) return "current";

    return "locked";
  };

  const completedCount = state.completedSteps.length;
  const totalSteps = CHECKLIST_ITEMS.length;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);
  const totalPossiblePoints = CHECKLIST_ITEMS.reduce((sum, item) => sum + item.points, 0);

  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Progresso da Jornada
          </span>
          <span className="text-xs font-bold text-purple-600">
            {completedCount}/{totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">
            Sua Jornada de Transformação
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{completedCount} de {totalSteps}</span>
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
              {progressPercentage}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 rounded-full relative"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>

        {/* Points Display */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Pontos ganhos: <span className="font-bold text-purple-600">{state.score}</span> / {totalPossiblePoints}
          </span>
          {progressPercentage === 100 && (
            <span className="text-green-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Completo!
            </span>
          )}
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {CHECKLIST_ITEMS.map((item, index) => {
          const status = getStepStatus(item.id);
          const isCompleted = status === "completed";
          const isCurrent = status === "current";
          const isLocked = status === "locked";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative rounded-xl p-4 border-2 transition-all duration-300
                ${isCompleted
                  ? "bg-green-50 border-green-300 shadow-sm"
                  : isCurrent
                  ? "bg-purple-50 border-purple-400 shadow-md ring-2 ring-purple-200"
                  : "bg-gray-50 border-gray-200 opacity-60"
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon & Status */}
                <div className="flex-shrink-0">
                  <div
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                      ${isCompleted
                        ? "bg-green-100"
                        : isCurrent
                        ? "bg-purple-100 ring-2 ring-purple-400 animate-pulse"
                        : "bg-gray-100"
                      }
                    `}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`
                        font-semibold
                        ${isCompleted
                          ? "text-green-900"
                          : isCurrent
                          ? "text-purple-900"
                          : "text-gray-600"
                        }
                      `}
                    >
                      {item.title}
                    </h4>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    {isCurrent && (
                      <Circle className="w-5 h-5 text-purple-600 flex-shrink-0 animate-pulse" />
                    )}
                    {isLocked && (
                      <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  <p
                    className={`
                      text-sm
                      ${isCompleted
                        ? "text-green-700"
                        : isCurrent
                        ? "text-purple-700"
                        : "text-gray-500"
                      }
                    `}
                  >
                    {item.description}
                  </p>

                  {/* Points Badge */}
                  <div className="mt-2">
                    <span
                      className={`
                        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                        ${isCompleted
                          ? "bg-green-200 text-green-800"
                          : isCurrent
                          ? "bg-purple-200 text-purple-800"
                          : "bg-gray-200 text-gray-600"
                        }
                      `}
                    >
                      {isCompleted ? "✓" : "+"} {item.points} pontos
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Step Indicator */}
              {isCurrent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -right-2 -top-2"
                >
                  <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    Atual
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        {progressPercentage === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-medium">
              🎯 Comece sua jornada agora e ganhe até {totalPossiblePoints} pontos!
            </p>
          </div>
        )}
        {progressPercentage > 0 && progressPercentage < 50 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-purple-800 font-medium">
              💪 Você está progredindo bem! Continue para desbloquear mais recompensas.
            </p>
          </div>
        )}
        {progressPercentage >= 50 && progressPercentage < 100 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-sm text-orange-800 font-medium">
              🔥 Você está quase lá! Apenas mais alguns passos para completar sua jornada!
            </p>
          </div>
        )}
        {progressPercentage === 100 && (
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-4 text-white">
            <p className="font-bold text-lg mb-1">🎉 Parabéns!</p>
            <p className="text-sm">
              Você completou toda a jornada e ganhou {state.score} pontos!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

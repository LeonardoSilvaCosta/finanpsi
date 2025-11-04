"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ number: number; label: string }>;
}

export default function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mb-8">
      {/* Texto do passo atual */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-finansi-primary">
            Passo {currentStep} de {totalSteps}
          </p>
          <p className="text-lg font-semibold text-finansi-primary">
            {steps[currentStep - 1]?.label}
          </p>
        </div>
        <span className="text-sm text-finansi-secondary">
          {currentStep}/{totalSteps}
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Indicadores de etapas */}
      <div className="flex justify-between mt-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-gray-200 text-finansi-tertiary"
                }`}
              >
                {isCompleted ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3333 4L6 11.3333L2.66667 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`text-xs mt-2 text-center ${
                  isCurrent
                    ? "font-semibold text-finansi-primary"
                    : isCompleted
                    ? "text-finansi-secondary"
                    : "text-finansi-tertiary"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


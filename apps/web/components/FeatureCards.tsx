"use client";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 8C15.164 8 8 15.164 8 24C8 32.836 15.164 40 24 40C32.836 40 40 32.836 40 24C40 15.164 32.836 8 24 8ZM24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C30.627 12 36 17.373 36 24C36 30.627 30.627 36 24 36Z"
          fill="currentColor"
        />
        <path
          d="M20 24L22 26L28 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 16C22.343 16 21 17.343 21 19C21 20.657 22.343 22 24 22C25.657 22 27 20.657 27 19C27 17.343 25.657 16 24 16Z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Diagnóstico Financeiro Digital",
    description: "Plano personalizado para sua situação específica",
    iconColor: "#8B4513", // Reddish-brown
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 8H40V40H8V8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 20H32M16 24H32M16 28H24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 32L28 28L32 32"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Ebook de Estratégia",
    description: "Guia prático com passos para levar os primeiros desafios",
    iconColor: "#6B995E", // Green
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="20" r="4" fill="currentColor" />
        <circle cx="32" cy="20" r="4" fill="currentColor" />
        <path
          d="M8 36C8 30 12 26 16 26H32C36 26 40 30 40 36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Comunidade Exclusiva",
    description: "Grupo de apoio no WhatsApp/Telegram com profissionais",
    iconColor: "#4A90E2", // Blue
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 8L28 18L38 20L30 28L32 38L24 32L16 38L18 28L10 20L20 18L24 8Z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Preço Especial",
    description: "Condições promocionais exclusivas para teste piloto",
    iconColor: "#E91E63", // Pink
  },
];

export default function FeatureCards() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] text-center mb-4">
            O que você vai receber
          </h2>
          <p className="text-[#666666] text-center mb-12 text-lg">
            Benefícios completos inclusos na sua Gratuidade
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div
                  className="mb-4 flex justify-center"
                  style={{ color: feature.iconColor }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-[#666666] text-sm text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


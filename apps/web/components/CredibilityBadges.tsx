"use client";

interface Credential {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const credentials: Credential[] = [
  {
    id: "privacy",
    name: "100% Privado e Seguro",
    description: "Seus dados estão protegidos com criptografia SSL",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 4L8 10V22C8 31.2 13.6 39.6 24 44C34.4 39.6 40 31.2 40 22V10L24 4Z"
          fill="currentColor"
          className="opacity-90"
        />
        <path
          d="M20 24L22 26L28 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-100"
        />
      </svg>
    ),
    color: "#6B995E",
  },
  {
    id: "lgpd",
    name: "LGPD Compliant",
    description: "Conforme Lei Geral de Proteção de Dados",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M16 24L20 28L32 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "#4A90E2",
  },
  {
    id: "crp",
    name: "Profissionais Registrados",
    description: "Focado em profissionais com CRP ativo",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" />
        <path
          d="M18 24L22 28L30 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "#8B4513",
  },
  {
    id: "trust",
    name: "Confiança e Transparência",
    description: "Projeto criado por profissionais para profissionais",
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
      </svg>
    ),
    color: "#6B995E",
  },
];

export default function CredibilityBadges() {
  return (
    <section className="py-12 bg-[#FFF8F5] border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {credentials.map((credential) => (
              <div
                key={credential.id}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="mb-3"
                  style={{ color: credential.color }}
                >
                  {credential.icon}
                </div>
                <h3 className="font-semibold text-finansi-primary text-sm mb-1">
                  {credential.name}
                </h3>
                <p className="text-xs text-finansi-secondary">
                  {credential.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


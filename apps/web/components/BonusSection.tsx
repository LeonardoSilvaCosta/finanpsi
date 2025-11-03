"use client";

export default function BonusSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="border-2 border-[#6B995E] rounded-lg p-8 bg-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#8B4513] rounded-full p-3">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M16 4L18 10L24 12L18 14L16 20L14 14L8 12L14 10L16 4Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16 24C20.418 24 24 20.418 24 16C24 11.582 20.418 8 16 8C11.582 8 8 11.582 8 16C8 20.418 11.582 24 16 24Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#333333]">
                  Bônus Especial de Lançamento
                </h3>
              </div>
            </div>

            <p className="text-[#666666] mb-6 text-lg">
              Ao se cadastrar hoje, você receberá adicionalmente:
            </p>

            <ul className="space-y-4">
              {[
                "Diagnóstico Financeiro personalizado e completo",
                "Ebook + Checklist de estratégia financeira exclusivo",
                "Acesso VIP ao grupo de suporte para profissionais",
                "Prioridade em campanhas e materiais futuros",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#6B995E] flex-shrink-0 mt-0.5"
                  >
                    <path
                      d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-[#333333] text-base">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-[#666666] text-center italic">
              Oferta válida apenas para os primeiros 100 inscritos do teste piloto
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


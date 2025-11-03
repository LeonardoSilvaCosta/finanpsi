"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { trackPageView, trackEvent } from "@/lib/analytics";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "você";
  const email = searchParams.get("email") || "";

  useEffect(() => {
    // Track page view
    trackPageView("/thank-you", "Obrigado - FinanPsi");

    // Track conversion event
    trackEvent("conversion", { step: "thank_you_page", email }, { category: "conversion" });
  }, [email]);

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        {/* Ícone de Sucesso */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Mensagem Principal */}
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Obrigado, {name}! 🎉
        </h1>

        <p className="text-xl text-muted-foreground mb-8">
          Recebemos seu interesse no <strong>Diagnóstico Financeiro</strong> e estamos animados para ajudar você!
        </p>

        {/* Caixa de Informações */}
        <div className="bg-card border rounded-lg p-8 mb-8 text-left">
          <h2 className="text-2xl font-semibold mb-4">O que acontece agora?</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Verifique seu email</h3>
                <p className="text-muted-foreground">
                  Enviamos um email para <strong>{email || "seu endereço"}</strong> com seu diagnóstico financeiro personalizado e próximos passos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Acesse seu diagnóstico</h3>
                <p className="text-muted-foreground">
                  No email, você encontrará um link para acessar seu diagnóstico completo e detalhado.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Comece sua jornada</h3>
                <p className="text-muted-foreground">
                  Siga as recomendações do diagnóstico e comece a transformar sua relação com o dinheiro.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-muted rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">O que você vai receber:</h3>
          <ul className="space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Diagnóstico financeiro personalizado</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Acesso ao curso online prático</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Comunidade VIP de apoio (se você se interessou)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Estratégias práticas para investir no seu crescimento</span>
            </li>
          </ul>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Voltar para início
          </Link>
          <a
            href={`mailto:contato@finanpsi.com.br?subject=Dúvida sobre Diagnóstico Financeiro&body=Olá, tenho uma dúvida sobre o diagnóstico financeiro...`}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Entrar em contato
          </a>
        </div>

        {/* Aviso sobre Email */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Não recebeu o email?</strong> Verifique sua caixa de spam ou lixeira. 
            Se ainda assim não encontrar, entre em contato conosco.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  );
}


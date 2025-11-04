"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Form from "@/components/Form";
import FeatureCards from "@/components/FeatureCards";
import BonusSection from "@/components/BonusSection";
import Footer from "@/components/Footer";
import CredibilityBadges from "@/components/CredibilityBadges";
import Testimonials from "@/components/Testimonials";
import UrgencyCounter from "@/components/UrgencyCounter";
import GamificationBadge from "@/components/GamificationBadge";
import ShareIncentive from "@/components/ShareIncentive";
import ProgressChecklist from "@/components/ProgressChecklist";
import FloatingGamificationWidget from "@/components/FloatingGamificationWidget";
import FAQ from "@/components/FAQ";
import { trackPageView, trackEvent } from "@/lib/analytics";

export default function Home() {
  useEffect(() => {
    trackPageView(window.location.pathname, document.title);
  }, []);

  return (
    <div className="min-h-screen bg-finansi-background">
      <Header />

      {/* Floating Gamification Widget */}
      <FloatingGamificationWidget />

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge "É um Lançamento Digital" */}
            <div className="mb-6 flex justify-center">
              <div className="badge-launch">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M8 0L10.163 5.837L16 8L10.163 10.163L8 16L5.837 10.163L0 8L5.837 5.837L8 0Z"
                    fill="currentColor"
                  />
                </svg>
                É um Lançamento Digital
              </div>
            </div>

            {/* Título Principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-finansi-primary mb-6 leading-tight max-w-4xl mx-auto">
              Diagnóstico Financeiro e Saúde Emocional para Profissionais da
              Saúde
            </h1>

            {/* Descrição */}
            <p className="text-lg md:text-xl text-finansi-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
              Transforme sua relação com dinheiro em poucos minutos. Descubra
              onde está seu maior desafio com dívidas, investimento ou ansiedade
              financeira — e receba um guia prático para mudar sua realidade!
            </p>

            {/* Botões CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => {
                  trackEvent(
                    "cta_primary_clicked",
                    { button: "fazer_diagnostico" },
                    { category: "cta" },
                  );
                  document
                    .getElementById("form-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-primary"
              >
                Fazer Diagnóstico Grátis
              </button>
              <button
                onClick={() => {
                  trackEvent(
                    "cta_secondary_clicked",
                    { button: "conhecer_comunidade" },
                    { category: "cta" },
                  );
                  document
                    .getElementById("form-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-secondary"
              >
                Conhecer Comunidade
              </button>
            </div>

            {/* Informações Adicionais */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-finansi-tertiary text-sm mb-12">
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-finansi-tertiary"
                >
                  <path
                    d="M8 0C3.582 0 0 3.582 0 8C0 12.418 3.582 16 8 16C12.418 16 16 12.418 16 8C16 3.582 12.418 0 8 0ZM8 14.4C4.472 14.4 1.6 11.528 1.6 8C1.6 4.472 4.472 1.6 8 1.6C11.528 1.6 14.4 4.472 14.4 8C14.4 11.528 11.528 14.4 8 14.4ZM8.8 4V7.2L11.2 8.8L10.4 9.6L7.6 7.6V4H8.8Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Lançamento de 6 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-finansi-tertiary"
                >
                  <path
                    d="M8 0C5.239 0 2.8 1.6 1.4 4L0 2.6V8H5.4L3.6 6.2C4.4 4.4 6.1 3.2 8 3.2C10.5 3.2 12.6 5.3 12.6 7.8C12.6 10.3 10.5 12.4 8 12.4C6.7 12.4 5.5 11.9 4.6 11L3.2 12.4C4.5 13.6 6.2 14.4 8 14.4C11.5 14.4 14.4 11.5 14.4 8C14.4 4.5 11.5 1.6 8 1.6Z"
                    fill="currentColor"
                  />
                  <path
                    d="M7.2 4.8V8L9.6 9.6L8.8 10.4L6 8.4V4.8H7.2Z"
                    fill="currentColor"
                  />
                </svg>
                <span>100% seguro e privado</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-success"
                >
                  <path
                    d="M8 0C3.582 0 0 3.582 0 8C0 12.418 3.582 16 8 16C12.418 16 16 12.418 16 8C16 3.582 12.418 0 8 0ZM11.707 6.293L7 11L4.293 8.293L5.707 6.879L7 8.172L10.293 4.879L11.707 6.293Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Vagas limitadas para teste piloto</span>
              </div>
            </div>
          </div>
        </section>

        {/* Selos de Credibilidade */}
        <CredibilityBadges />

        {/* Seção "O que você vai receber" */}
        <FeatureCards />

        {/* Gamification Section */}
        <section className="py-12 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-finansi-primary mb-4">
                  🎮 Acompanhe Sua Jornada
                </h2>
                <p className="text-finansi-secondary text-lg">
                  Complete os passos e desbloqueie conquistas exclusivas!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Progress Checklist */}
                <div>
                  <ProgressChecklist />
                </div>

                {/* Gamification Badge */}
                <div className="space-y-6">
                  <GamificationBadge showProgress={true} />

                  {/* Mini motivational card */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-200 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">🏆</div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Você está a 1 passo de desbloquear seu diagnóstico!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Continue preenchendo o formulário para ganhar mais pontos
                      e badges
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="form-section" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-finansi-primary mb-4">
                  Inscrição Gratuita
                </h2>
                <p className="text-finansi-secondary text-lg">
                  Vagas limitadas para teste piloto! Garante a sua agora.
                </p>
              </div>

              {/* Contador de Urgência */}
              <div className="mb-8">
                <UrgencyCounter totalSlots={100} baseCount={0} />
              </div>

              <Form />
              <p className="text-center text-finansi-secondary text-sm mt-4">
                Ao se cadastrar, você receberá todas as informações para a
                comunidade e bônus exclusivos.
              </p>
            </div>
          </div>
        </section>

        {/* Share Incentive Section */}
        <section className="py-16 bg-gradient-to-b from-white to-green-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <ShareIncentive
                title="🎁 Desbloqueie Bônus Exclusivos!"
                description="Compartilhe com amigos e ganhe acesso imediato a materiais premium"
                bonusItems={[
                  "📊 Planilha de Controle Financeiro Avançada",
                  "📚 E-book: 7 Passos para Saúde Financeira",
                  "🎯 Guia Prático de Investimentos para Iniciantes",
                  "💡 Checklist de Organização Financeira",
                ]}
              />
            </div>
          </div>
        </section>

        {/* Seção Bônus */}
        <BonusSection />

        {/* Depoimentos */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}

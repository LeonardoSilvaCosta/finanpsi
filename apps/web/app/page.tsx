"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Form from "@/components/Form";
import FeatureCards from "@/components/FeatureCards";
import BonusSection from "@/components/BonusSection";
import Footer from "@/components/Footer";
import { trackPageView, trackEvent } from "@/lib/analytics";

export default function Home() {
  useEffect(() => {
    trackPageView(window.location.pathname, document.title);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge "É um Lançamento Digital" */}
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 bg-[#8B4513] text-white px-4 py-2 rounded-full text-sm font-medium">
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#333333] mb-6 leading-tight max-w-4xl mx-auto">
              Diagnóstico Financeiro e Saúde Emocional para Profissionais da Saúde
            </h1>

            {/* Descrição */}
            <p className="text-lg md:text-xl text-[#666666] mb-8 max-w-3xl mx-auto leading-relaxed">
              Transforme sua relação com dinheiro em poucos minutos. Descubra onde está seu maior desafio com dívidas, investimento ou ansiedade financeira — e receba um guia prático para mudar sua realidade!
            </p>

            {/* Botões CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => {
                  trackEvent("cta_primary_clicked", { button: "fazer_diagnostico" }, { category: "cta" });
                  document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-[#6B995E] text-white px-8 py-4 rounded-lg font-medium hover:opacity-90 transition-opacity text-base"
              >
                Fazer Diagnóstico Grátis
              </button>
              <button
                onClick={() => {
                  trackEvent("cta_secondary_clicked", { button: "conhecer_comunidade" }, { category: "cta" });
                  document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-[#A8D5BA] text-[#6B995E] border-2 border-[#6B995E] px-8 py-4 rounded-lg font-medium hover:bg-[#6B995E] hover:text-white transition-colors text-base"
              >
                Conhecer Comunidade
              </button>
            </div>

            {/* Informações Adicionais */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-[#999999] text-sm mb-12">
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#999999]"
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
                  className="text-[#999999]"
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
                  className="text-[#8BC34A]"
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

        {/* Seção "O que você vai receber" */}
        <FeatureCards />

        {/* Form Section */}
        <section id="form-section" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
                  Inscrição Gratuita
                </h2>
                <p className="text-[#666666] text-lg">
                  Vagas limitadas para teste piloto! Garanta a sua agora.
                </p>
              </div>
              <Form />
              <p className="text-center text-[#666666] text-sm mt-4">
                Ao se cadastrar, você receberá todas as informações para a comunidade e bônus exclusivos.
              </p>
            </div>
          </div>
        </section>

        {/* Seção Bônus */}
        <BonusSection />
      </main>

      <Footer />
    </div>
  );
}

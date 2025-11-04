"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormEvents } from "@/lib/analytics";
import { analyzeChallenge } from "@/lib/diagnosis";
import {
  isValidEmail,
  isValidEmailDomain,
  getValidationError,
} from "@/lib/validation";
import ProgressBar from "@/components/ProgressBar";
import { useGamification } from "@/lib/gamification";
import GamificationBadge from "@/components/GamificationBadge";

const STEPS = [
  { number: 1, label: "Sobre você" },
  { number: 2, label: "Seu desafio" },
  { number: 3, label: "Deseja entrar no grupo VIP?" },
];

export default function Form() {
  const router = useRouter();
  const { unlockBadge, completeStep, addScore, updateBadgeProgress } =
    useGamification();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    challenge: "",
    groupAccepted: true, // Padrão: Sim, quero fazer parte da comunidade
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [formStarted, setFormStarted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Estados para diagnóstico instantâneo
  const [instantDiagnosis, setInstantDiagnosis] = useState<any>(null);
  const [isDiagnosisLoading, setIsDiagnosisLoading] = useState(false);
  const [showDiagnosisPreview, setShowDiagnosisPreview] = useState(false);

  // Track quando formulário é iniciado (primeira interação)
  useEffect(() => {
    if (
      !formStarted &&
      (form.name || form.email || form.profession || form.challenge)
    ) {
      setFormStarted(true);
      FormEvents.formStarted();
      // Desbloquear badge de início
      unlockBadge("started");
    }
  }, [form, formStarted, unlockBadge]);

  // Validação em tempo real
  function validateField(field: string, value: string) {
    const error = getValidationError(field, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  // Validação por etapa
  function validateStep(step: number): boolean {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Passo 1: Nome e Email são obrigatórios
      const nameError = getValidationError("name", form.name);
      if (nameError) newErrors.name = nameError;

      const emailError = getValidationError("email", form.email);
      if (emailError) newErrors.email = emailError;

      // Telefone é opcional, mas se preenchido, deve ser válido
      if (form.phone && form.phone.trim()) {
        const phoneError = getValidationError("phone", form.phone);
        if (phoneError) newErrors.phone = phoneError;
      }
    } else if (step === 2) {
      // Passo 2: Profissão e Desafio são obrigatórios
      if (!form.profession?.trim()) {
        newErrors.profession = "Profissão é obrigatória";
      }

      if (!form.challenge?.trim()) {
        newErrors.challenge = "Desafio financeiro é obrigatório";
      } else if (form.challenge.trim().length < 10) {
        newErrors.challenge =
          "Descreva seu desafio com pelo menos 10 caracteres";
      }
    }
    // Passo 3 não precisa validação (só escolha de grupo)

    setErrors(newErrors);

    // Marcar campos como tocados
    if (step === 1) {
      setTouched((prev) => ({ ...prev, name: true, email: true }));
    } else if (step === 2) {
      setTouched((prev) => ({ ...prev, profession: true, challenge: true }));
    }

    return Object.keys(newErrors).length === 0;
  }

  // Validação completa do formulário (para submit final)
  function validateForm(): boolean {
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    return step1Valid && step2Valid;
  }

  function nextStep(e?: React.MouseEvent) {
    // Prevenir qualquer comportamento padrão (caso seja chamado por submit acidental)
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        // Gamification: Marcar step como completo e dar pontos
        if (currentStep === 1) {
          completeStep("step_1");
          unlockBadge("profile_complete");
          addScore(10);
          updateBadgeProgress("almost_there", 33);
        } else if (currentStep === 2) {
          completeStep("step_2");
          unlockBadge("challenge_shared");
          addScore(20);
          updateBadgeProgress("almost_there", 66);
        }

        setCurrentStep(currentStep + 1);

        // Scroll suave para o topo do formulário
        document
          .getElementById("form-section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  // Handler para prevenir Enter nos campos antes do último step
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && currentStep < STEPS.length) {
      e.preventDefault();
      // Se estiver no último campo do step atual, avançar para próximo
      if (currentStep === 1 && form.name && form.email) {
        nextStep();
      } else if (
        currentStep === 2 &&
        form.profession &&
        form.challenge &&
        form.challenge.length >= 10
      ) {
        nextStep();
      }
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll suave para o topo do formulário
      document
        .getElementById("form-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // CRÍTICO: Só permite submit no último step
    if (currentStep !== STEPS.length) {
      console.warn("Tentativa de submit antes do último step. Ignorando.");
      return;
    }

    // Validar formulário antes de enviar
    if (!validateForm()) {
      setStatus("error");
      FormEvents.formError("Validação falhou", {
        validationErrors: Object.keys(errors),
      });

      // Voltar para a primeira etapa com erro
      if (!validateStep(1)) {
        setCurrentStep(1);
      } else if (!validateStep(2)) {
        setCurrentStep(2);
      }
      return;
    }

    setStatus("loading");

    // Analisar tipo de desafio para tracking (antes do try para usar no catch)
    const challengeAnalysis = analyzeChallenge(form.challenge);

    // Track submit
    FormEvents.formSubmitted({
      profession: form.profession || "não informado",
      challengeCategory: challengeAnalysis.category,
      challengeKeywords: challengeAnalysis.keywords,
      groupAccepted: form.groupAccepted,
      challengeConfidence: challengeAnalysis.confidence,
    });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}) as any);
        setStatus("success");

        // Gamification: Completar último step e desbloquear diagnóstico
        completeStep("step_3");
        if (form.groupAccepted) {
          unlockBadge("community_member");
          addScore(15);
        }
        completeStep("step_5");
        unlockBadge("diagnosis_unlocked");
        updateBadgeProgress("almost_there", 100);
        addScore(30);

        // Track success
        FormEvents.formSuccess({
          emailSent: data.emailSent !== false,
          webhookSent: data.webhookSent !== false,
          diagnosisMethod: data.diagnosis?.method || "unknown",
          diagnosisResponseTime: data.diagnosis?.responseTime || 0,
        });

        if (data && data.emailSent === false) {
          console.warn("Envio de email falhou no servidor (emailSent=false)");
        }

        // Redirecionar para página de agradecimento após 1 segundo
        setTimeout(() => {
          router.push(
            `/thank-you?name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}`,
          );
        }, 1000);
      } else {
        setStatus("error");
        const errorText = await res.text().catch(() => "Erro desconhecido");

        // Tentar parsear JSON para obter mensagem de erro mais específica
        let errorMessage = "Erro ao enviar formulário. Tente novamente.";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || errorMessage;
        } catch {
          // Se não for JSON, usar texto direto se for menor que 100 caracteres
          if (errorText && errorText.length < 100) {
            errorMessage = errorText;
          }
        }

        // Track error
        FormEvents.formError(errorText, {
          status: res.status,
          profession: form.profession || "não informado",
          challengeCategory: challengeAnalysis.category,
        });

        // Atualizar mensagem de erro específica
        setErrors({ submit: errorMessage });
      }
    } catch (error: any) {
      console.error("Error:", error);
      setStatus("error");

      // Mensagem de erro de rede
      const errorMessage = error.message?.includes("fetch")
        ? "Erro de conexão. Verifique sua internet e tente novamente."
        : error.message || "Erro ao enviar formulário. Tente novamente.";

      setErrors({ submit: errorMessage });

      // Track error
      FormEvents.formError(error.message || "Erro de rede", {
        profession: form.profession || "não informado",
        challengeCategory: challengeAnalysis.category,
      });
    }
  }

  // Função para obter diagnóstico instantâneo
  async function handleInstantDiagnosis() {
    if (!form.challenge || form.challenge.trim().length < 10) {
      return;
    }

    setIsDiagnosisLoading(true);
    setInstantDiagnosis(null);

    try {
      const res = await fetch("/api/instant-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge: form.challenge,
          profession: form.profession,
          name: form.name || "Usuário",
          type: "basic",
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao obter diagnóstico");
      }

      const data = await res.json();
      setInstantDiagnosis(data.diagnosis);
      setShowDiagnosisPreview(true);
    } catch (error: any) {
      console.error("Erro no diagnóstico instantâneo:", error);
    } finally {
      setIsDiagnosisLoading(false);
    }
  }

  // Renderizar campos do passo atual
  function renderStepFields() {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2 text-[#333333]"
              >
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (touched.name) {
                    validateField("name", e.target.value);
                  }
                  if (e.target.value.length > 0) {
                    FormEvents.formFieldCompleted("name");
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, name: true }));
                  validateField("name", form.name);
                }}
                onFocus={() => FormEvents.formFieldFocused("name")}
                onKeyDown={handleKeyDown}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B995E] focus:border-[#6B995E] ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Seu nome completo"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-[#333333]"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (touched.email) {
                    validateField("email", e.target.value);
                  }
                  if (e.target.value.includes("@")) {
                    FormEvents.formFieldCompleted("email");
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  validateField("email", form.email);
                }}
                onFocus={() => FormEvents.formFieldFocused("email")}
                onKeyDown={handleKeyDown}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B995E] focus:border-[#6B995E] ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-2 text-[#333333]"
              >
                Telefone{" "}
                <span className="text-[#666666] text-xs">(opcional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (touched.phone) {
                    validateField("phone", e.target.value);
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, phone: true }));
                  validateField("phone", form.phone);
                }}
                onFocus={() => FormEvents.formFieldFocused("phone")}
                onKeyDown={handleKeyDown}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B995E] focus:border-[#6B995E] ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="(XX) XXXXX-XXXX"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="profession"
                className="block text-sm font-medium mb-2 text-[#333333]"
              >
                Profissão <span className="text-red-500">*</span>
              </label>
              <input
                id="profession"
                type="text"
                value={form.profession}
                onChange={(e) => {
                  setForm({ ...form, profession: e.target.value });
                  if (e.target.value.length > 0) {
                    FormEvents.formFieldCompleted("profession", e.target.value);
                  }
                }}
                onFocus={() => FormEvents.formFieldFocused("profession")}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, profession: true }));
                  if (!form.profession?.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      profession: "Profissão é obrigatória",
                    }));
                  }
                }}
                onKeyDown={handleKeyDown}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B995E] focus:border-[#6B995E] ${
                  errors.profession ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: Psicologia, Terapia, Médico"
              />
              {errors.profession && (
                <p className="text-sm text-red-600 mt-1">{errors.profession}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="challenge"
                className="block text-sm font-medium mb-2 text-[#333333]"
              >
                Qual é seu maior desafio financeiro/emocional hoje?{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="challenge"
                value={form.challenge}
                onChange={(e) => {
                  setForm({ ...form, challenge: e.target.value });
                  if (e.target.value.length > 10) {
                    FormEvents.formFieldCompleted("challenge");
                  }
                }}
                onFocus={() => FormEvents.formFieldFocused("challenge")}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, challenge: true }));
                  if (!form.challenge?.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      challenge: "Desafio financeiro é obrigatório",
                    }));
                  } else if (form.challenge.trim().length < 10) {
                    setErrors((prev) => ({
                      ...prev,
                      challenge:
                        "Descreva seu desafio com pelo menos 10 caracteres",
                    }));
                  }
                }}
                onKeyDown={handleKeyDown}
                required
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B995E] focus:border-[#6B995E] resize-none ${
                  errors.challenge ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Descreva brevemente seu maior desafio..."
              />
              {errors.challenge && (
                <p className="text-sm text-red-600 mt-1">{errors.challenge}</p>
              )}
              <p className="text-xs text-finansi-tertiary mt-1">
                Mínimo 10 caracteres
              </p>
            </div>

            {/* Botão para diagnóstico instantâneo */}
            {form.challenge && form.challenge.trim().length >= 10 && (
              <div className="mt-6 p-4 bg-[#FFF8F5] border border-[#A8D5BA] rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#6B995E] rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#333333] mb-1">
                      🎯 Veja sua prévia de diagnóstico agora!
                    </h4>
                    <p className="text-sm text-[#666666] mb-3">
                      Receba uma análise instantânea do seu desafio antes mesmo
                      de completar o cadastro. O diagnóstico completo será
                      enviado por e-mail.
                    </p>
                    <button
                      type="button"
                      onClick={handleInstantDiagnosis}
                      disabled={isDiagnosisLoading}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#6B995E] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-sm"
                    >
                      {isDiagnosisLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Analisando...
                        </span>
                      ) : (
                        "✨ Ver Prévia do Diagnóstico"
                      )}
                    </button>
                  </div>
                </div>

                {/* Preview do diagnóstico */}
                {showDiagnosisPreview && instantDiagnosis && (
                  <div className="mt-4 p-4 bg-white border border-[#A8D5BA] rounded-lg animate-fadeIn">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-2xl">💡</span>
                      <div className="flex-1">
                        <h5 className="font-semibold text-[#333333] mb-2">
                          Sua Prévia de Diagnóstico
                        </h5>
                        <div className="space-y-2 text-sm text-[#666666]">
                          <p className="font-medium text-[#6B995E]">
                            Categoria: {instantDiagnosis.category}
                          </p>
                          <p>{instantDiagnosis.message}</p>

                          {instantDiagnosis.nextSteps && (
                            <div className="mt-3 pt-3 border-t border-[#A8D5BA]">
                              <p className="font-medium text-[#333333] mb-2">
                                Próximos passos:
                              </p>
                              <ul className="list-disc list-inside space-y-1 text-[#666666]">
                                {instantDiagnosis.nextSteps.map(
                                  (step: string, idx: number) => (
                                    <li key={idx}>{step}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-[#FFF8F5] rounded-lg">
                      <p className="text-xs text-[#666666] text-center">
                        💌 <strong>Complete seu cadastro</strong> para receber o
                        diagnóstico completo e personalizado por e-mail, com
                        análises detalhadas e plano de ação específico para
                        você!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-4 text-[#333333]">
                Aceita participar do grupo de apoio?
              </label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 border-gray-200 hover:bg-gray-50 hover:border-[#6B995E] transition-all">
                  <input
                    type="radio"
                    name="groupAccepted"
                    checked={form.groupAccepted === true}
                    onChange={() => setForm({ ...form, groupAccepted: true })}
                    className="cursor-pointer w-5 h-5 text-[#6B995E] focus:ring-[#6B995E]"
                  />
                  <div className="flex-1">
                    <span className="text-[#333333] font-medium">
                      Sim, quero fazer parte da comunidade!
                    </span>
                    <p className="text-sm text-finansi-secondary mt-1">
                      Receba apoio, dicas exclusivas e participe de discussões
                      com outros profissionais
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 border-gray-200 hover:bg-gray-50 hover:border-[#6B995E] transition-all">
                  <input
                    type="radio"
                    name="groupAccepted"
                    checked={form.groupAccepted === false}
                    onChange={() => setForm({ ...form, groupAccepted: false })}
                    className="cursor-pointer w-5 h-5 text-[#6B995E] focus:ring-[#6B995E]"
                  />
                  <div className="flex-1">
                    <span className="text-[#333333] font-medium">
                      Não, só quero o diagnóstico
                    </span>
                    <p className="text-sm text-finansi-secondary mt-1">
                      Receba apenas o diagnóstico financeiro personalizado
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  // Handler para prevenir submit acidental antes do último step
  function handleFormSubmit(e: React.FormEvent) {
    // Se não estiver no último step, tratar como navegação
    if (currentStep < STEPS.length) {
      e.preventDefault();
      nextStep();
      return;
    }
    // Se estiver no último step, processar submit normalmente
    handleSubmit(e);
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white p-8 rounded-lg border border-border shadow-sm"
    >
      {/* Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        totalSteps={STEPS.length}
        steps={STEPS}
      />

      {/* Campos do passo atual */}
      <div className="mb-6">{renderStepFields()}</div>

      {/* Mensagens de status */}
      {status === "success" && (
        <p className="text-green-600 text-center font-medium mb-4">
          Obrigado! Verifique seu email.
        </p>
      )}

      {status === "error" && (
        <div className="mb-4">
          <p className="text-red-600 text-center font-medium">
            {errors.submit || "Erro ao enviar formulário. Tente novamente."}
          </p>
          {errors.submit && errors.submit.length > 50 && (
            <p className="text-sm text-red-500 text-center mt-2">
              Se o problema persistir, entre em contato conosco.
            </p>
          )}
        </div>
      )}

      {/* Botões de navegação */}
      <div className="flex gap-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-3 px-6 bg-gray-200 text-[#333333] rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Anterior
          </button>
        )}

        {currentStep < STEPS.length ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextStep(e);
            }}
            className="flex-1 py-3 px-6 bg-[#6B995E] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Próximo
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex-1 py-3 px-6 bg-[#6B995E] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {status === "loading"
              ? "Enviando..."
              : "Receber Diagnóstico Grátis"}
          </button>
        )}
      </div>
    </form>
  );
}

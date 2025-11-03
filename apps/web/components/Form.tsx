'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FormEvents } from '@/lib/analytics'
import { analyzeChallenge } from '@/lib/diagnosis'
import { isValidEmail, isValidEmailDomain, getValidationError } from '@/lib/validation'

export default function Form() {
  const router = useRouter()
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    profession: '', 
    challenge: '', 
    groupAccepted: true // Padrão: Sim, quero fazer parte da comunidade
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formStarted, setFormStarted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Track quando formulário é iniciado (primeira interação)
  useEffect(() => {
    if (!formStarted && (form.name || form.email || form.profession || form.challenge)) {
      setFormStarted(true)
      FormEvents.formStarted()
    }
  }, [form, formStarted])

  // Validação em tempo real
  function validateField(field: string, value: string) {
    const error = getValidationError(field, value)
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Validação completa do formulário
  function validateForm(): boolean {
    const newErrors: Record<string, string> = {}

    const emailError = getValidationError('email', form.email)
    if (emailError) newErrors.email = emailError

    const nameError = getValidationError('name', form.name)
    if (nameError) newErrors.name = nameError

    if (!form.profession?.trim()) {
      newErrors.profession = 'Profissão é obrigatória'
    }

    if (!form.challenge?.trim()) {
      newErrors.challenge = 'Desafio financeiro é obrigatório'
    }

    setErrors(newErrors)
    setTouched({
      name: true,
      email: true,
      profession: true,
      challenge: true,
    })

    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validar formulário antes de enviar
    if (!validateForm()) {
      setStatus('error')
      FormEvents.formError('Validação falhou', { validationErrors: Object.keys(errors) })
      return
    }

    setStatus('loading')

    // Analisar tipo de desafio para tracking
    const challengeAnalysis = analyzeChallenge(form.challenge)

    // Track submit
    FormEvents.formSubmitted({
      profession: form.profession || 'não informado',
      challengeCategory: challengeAnalysis.category,
      challengeKeywords: challengeAnalysis.keywords,
      groupAccepted: form.groupAccepted,
      challengeConfidence: challengeAnalysis.confidence,
    })

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        const data = await res.json().catch(() => ({} as any))
        setStatus('success')
        
        // Track success
        FormEvents.formSuccess({
          emailSent: data.emailSent !== false,
          webhookSent: data.webhookSent !== false,
          diagnosisMethod: data.diagnosis?.method || 'unknown',
          diagnosisResponseTime: data.diagnosis?.responseTime || 0,
        })

        if (data && data.emailSent === false) {
          console.warn('Envio de email falhou no servidor (emailSent=false)')
        }

        // Redirecionar para página de agradecimento após 1 segundo
        setTimeout(() => {
          router.push(`/thank-you?name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}`)
        }, 1000)
      } else {
        setStatus('error')
        const errorText = await res.text().catch(() => 'Erro desconhecido')
        
        // Track error
        FormEvents.formError(errorText, {
          status: res.status,
          profession: form.profession || 'não informado',
          challengeCategory: challengeAnalysis.category,
        })
      }
    } catch (error: any) {
      console.error('Error:', error)
      setStatus('error')
      
      // Track error
      FormEvents.formError(error.message || 'Erro de rede', {
        profession: form.profession || 'não informado',
        challengeCategory: challengeAnalysis.category,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-lg border border-border shadow-sm">

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#333333]">
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value })
            if (touched.name) {
              validateField('name', e.target.value)
            }
            if (e.target.value.length > 0) {
              FormEvents.formFieldCompleted('name')
            }
          }}
          onBlur={() => {
            setTouched(prev => ({ ...prev, name: true }))
            validateField('name', form.name)
          }}
          onFocus={() => FormEvents.formFieldFocused('name')}
          required
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B995E] focus:border-[#6B995E] ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Seu nome completo"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#333333]">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value })
            if (touched.email) {
              validateField('email', e.target.value)
            }
            if (e.target.value.includes('@')) {
              FormEvents.formFieldCompleted('email')
            }
          }}
          onBlur={() => {
            setTouched(prev => ({ ...prev, email: true }))
            validateField('email', form.email)
          }}
          onFocus={() => FormEvents.formFieldFocused('email')}
          required
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B995E] focus:border-[#6B995E] ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2 text-[#333333]">
          Telefone <span className="text-[#666666] text-xs">(opcional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => {
            setForm({ ...form, phone: e.target.value })
            if (touched.phone) {
              validateField('phone', e.target.value)
            }
          }}
          onBlur={() => {
            setTouched(prev => ({ ...prev, phone: true }))
            validateField('phone', form.phone)
          }}
          onFocus={() => FormEvents.formFieldFocused('phone')}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B995E] focus:border-[#6B995E] ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="(XX) XXXXX-XXXX"
        />
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="profession" className="block text-sm font-medium mb-2 text-[#333333]">
          Profissão
        </label>
        <input
          id="profession"
          type="text"
          value={form.profession}
          onChange={(e) => {
            setForm({ ...form, profession: e.target.value })
            if (e.target.value.length > 0) {
              FormEvents.formFieldCompleted('profession', e.target.value)
            }
          }}
          onFocus={() => FormEvents.formFieldFocused('profession')}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B995E] focus:border-[#6B995E]"
          placeholder="Ex: Psicologia, Terapia, Médico"
        />
      </div>

      <div>
        <label htmlFor="challenge" className="block text-sm font-medium mb-2 text-[#333333]">
          Qual é seu maior desafio financeiro/emocional hoje?
        </label>
        <textarea
          id="challenge"
          value={form.challenge}
          onChange={(e) => {
            setForm({ ...form, challenge: e.target.value })
            if (e.target.value.length > 10) {
              FormEvents.formFieldCompleted('challenge')
            }
          }}
          onFocus={() => FormEvents.formFieldFocused('challenge')}
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B995E] focus:border-[#6B995E] resize-none"
          placeholder="Descreva brevemente seu maior desafio..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#333333]">
          Aceita participar do grupo de apoio?
        </label>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="groupAccepted"
              checked={form.groupAccepted === true}
              onChange={() => setForm({ ...form, groupAccepted: true })}
              className="cursor-pointer"
            />
            <span className="text-[#333333]">Sim, quero fazer parte da comunidade!</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="groupAccepted"
              checked={form.groupAccepted === false}
              onChange={() => setForm({ ...form, groupAccepted: false })}
              className="cursor-pointer"
            />
            <span className="text-[#333333]">Não, só quero o diagnóstico</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 px-8 bg-[#6B995E] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-base"
      >
        {status === 'loading' ? 'Enviando...' : 'Receber Diagnóstico Grátis'}
      </button>

      {status === 'success' && (
        <p className="text-green-600 text-center font-medium">
          Obrigado! Verifique seu email.
        </p>
      )}

      {status === 'error' && (
        <p className="text-red-600 text-center font-medium">
          Erro ao enviar formulário. Tente novamente.
        </p>
      )}
    </form>
  )
}

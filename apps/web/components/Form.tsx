'use client'

import { useState } from 'react'

export default function Form() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    profession: '', 
    challenge: '', 
    groupAccepted: false 
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        const data = await res.json().catch(() => ({} as any))
        setStatus('success')
        if (data && data.emailSent === false) {
          console.warn('Envio de email falhou no servidor (emailSent=false)')
        }
        setForm({ name: '', email: '', profession: '', challenge: '', groupAccepted: false })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Error:', error)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-8 rounded-lg border">
      <h2 className="text-2xl font-semibold mb-6">Comece sua jornada</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Nome"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Email"
        />
      </div>

      <div>
        <label htmlFor="profession" className="block text-sm font-medium mb-2">
          Profissão
        </label>
        <input
          id="profession"
          type="text"
          value={form.profession}
          onChange={(e) => setForm({ ...form, profession: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Profissão"
        />
      </div>

      <div>
        <label htmlFor="challenge" className="block text-sm font-medium mb-2">
          Maior desafio financeiro
        </label>
        <textarea
          id="challenge"
          value={form.challenge}
          onChange={(e) => setForm({ ...form, challenge: e.target.value })}
          required
          rows={4}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Maior desafio"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Aceita participar de grupo de apoio?
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={form.groupAccepted === true}
              onChange={() => setForm({ ...form, groupAccepted: true })}
              className="cursor-pointer"
            />
            <span>Sim</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={form.groupAccepted === false}
              onChange={() => setForm({ ...form, groupAccepted: false })}
              className="cursor-pointer"
            />
            <span>Não</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {status === 'loading' ? 'Enviando...' : 'Receber diagnóstico'}
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

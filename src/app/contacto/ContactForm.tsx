'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    // Placeholder: in production this would call a server action
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus('sent')
    setFormData({ name: '', email: '', message: '' })
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success mb-4">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-medium text-charcoal">Mensaje enviado</p>
        <p className="mt-1 text-sm text-gray-warm">
          Nos pondremos en contacto contigo pronto.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-gold hover:text-gold-dark transition-colors"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1.5">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-cream px-4 py-2.5 text-sm text-charcoal placeholder:text-gray-warm/60 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-cream px-4 py-2.5 text-sm text-charcoal placeholder:text-gray-warm/60 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
          placeholder="tu@correo.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1.5">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-cream px-4 py-2.5 text-sm text-charcoal placeholder:text-gray-warm/60 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors resize-none"
          placeholder="¿En qué podemos ayudarte?"
        />
      </div>
      <Button type="submit" loading={status === 'sending'} className="w-full">
        Enviar mensaje
      </Button>
    </form>
  )
}

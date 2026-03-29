import { Cormorant_Garamond } from 'next/font/google'
import SectionHeader from '@/components/ui/SectionHeader'
import ContactForm from './ContactForm'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'Contacto | Cucú Becerra',
  description:
    'Contáctanos para conocer más sobre nuestros ropones y trajes de bautizo artesanales. Visítanos en Tlacoquemecatl del Valle, CDMX.',
}

const contactInfo = [
  {
    label: 'Dirección',
    value: 'Cda. Felix Cuevas 13, Tlacoquemecatl del Valle, CDMX',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: 'Teléfono',
    value: '55 8036 6177',
    href: 'tel:+525558036177',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    label: 'Correo electrónico',
    value: 'hola@cucubecerra.com',
    href: 'mailto:hola@cucubecerra.com',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: 'Horario',
    value: 'Lunes a Viernes: 10:00 - 18:00\nSábado: 10:00 - 14:00',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <SectionHeader
        title="Contacto"
        subtitle="Estamos aquí para ayudarte. Escríbenos o visítanos en nuestro taller."
        titleClassName={cormorant.className}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact info + map */}
        <div className="space-y-8">
          <div className="space-y-6">
            {contactInfo.map((info) => (
              <div key={info.label} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  {info.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    {info.label}
                  </p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-sm text-gray-warm hover:text-gold transition-colors whitespace-pre-line"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-warm whitespace-pre-line">
                      {info.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Google Maps embed */}
          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              title="Ubicación de Cucú Becerra"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.6!2d-99.175!3d19.3725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCda.+F%C3%A9lix+Cuevas+13%2C+Tlacoquemecatl+del+Valle%2C+CDMX!5e0!3m2!1ses!2smx!4v1"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Contact form */}
        <div className="rounded-lg border border-border bg-white p-8">
          <h2 className={`${cormorant.className} text-2xl font-semibold text-charcoal mb-6`}>
            Enviar mensaje
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

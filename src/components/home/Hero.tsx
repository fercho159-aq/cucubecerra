import Image from 'next/image'
import Button from '@/components/ui/Button'

interface HeroProps {
  serifClassName: string
}

export default function Hero({ serifClassName }: HeroProps) {
  return (
    <section className="relative overflow-hidden min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
      {/* Background image */}
      <Image
        src="/images/hero-homepage.png"
        alt="Escena de bautizo con seda marfil, ramas de olivo y cruz"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 via-40% to-cream/10" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-36 md:px-8">
        <div className="max-w-xl text-left">
          <h1
            className={`${serifClassName} text-4xl md:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight`}
          >
            Tradición hecha a mano para los momentos más sagrados
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-warm max-w-md leading-relaxed">
            Ropones y trajes de bautizo artesanales, confeccionados con amor en
            la Ciudad de México
          </p>
          <div className="mt-10">
            <Button href="/tienda" size="lg">
              Explorar Colección
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  )
}

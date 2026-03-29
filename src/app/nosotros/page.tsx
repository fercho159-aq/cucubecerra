import Image from 'next/image'
import { Cormorant_Garamond } from 'next/font/google'
import SectionHeader from '@/components/ui/SectionHeader'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'Nosotros | Cucú Becerra',
  description:
    'Conoce la historia de Cucú Becerra, taller artesanal de ropones y trajes de bautizo en la Ciudad de México.',
}

const values = [
  {
    title: 'Artesanía',
    description:
      'Cada prenda es cortada, cosida y terminada a mano por artesanas expertas que dominan técnicas heredadas por generaciones.',
  },
  {
    title: 'Calidad',
    description:
      'Seleccionamos cuidadosamente cada tela, cada botón y cada encaje para garantizar prendas que se conservan como recuerdo familiar.',
  },
  {
    title: 'Tradición',
    description:
      'Honramos la tradición del bautizo mexicano creando piezas que reflejan la importancia de este momento sagrado.',
  },
  {
    title: 'Amor',
    description:
      'Cada puntada lleva el amor y la dedicación de quienes entienden que vestir a un bebé para su bautizo es un acto de fe y celebración.',
  },
]

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-beige to-cream">
        <div className="mx-auto max-w-4xl px-4 py-24 md:px-8 text-center">
          <h1 className={`${cormorant.className} text-4xl md:text-5xl font-semibold text-charcoal leading-tight`}>
            Nuestra Historia
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="h-px w-12 bg-gold" />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-20 md:px-8">
        <div className="space-y-6 text-gray-warm leading-relaxed text-lg">
          <p>
            Cucú Becerra nació del deseo de preservar una tradición que nos conecta
            con nuestras raíces: el bautizo. En un pequeño taller en la colonia
            Tlacoquemecatl del Valle, en el corazón de la Ciudad de México,
            comenzamos a confeccionar ropones y trajes de bautizo que fueran tan
            especiales como el momento que representan.
          </p>
          <p>
            Cada pieza que sale de nuestro taller es el resultado de horas de
            trabajo manual, de la selección meticulosa de materiales y del
            conocimiento acumulado de artesanas que han dedicado su vida a la
            costura fina. Utilizamos organza, seda, lino y encajes importados
            para crear prendas que no solo visten, sino que cuentan una historia.
          </p>
          <p>
            Creemos que la ropa de bautizo debe ser más que una prenda: debe ser
            un tesoro familiar que se guarde con cariño y se transmita de
            generación en generación. Por eso ponemos el mismo cuidado en cada
            detalle, desde la primera puntada hasta el último acabado.
          </p>
        </div>
      </section>

      {/* Workshop image */}
      <section className="bg-beige">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="relative aspect-[3/2] md:aspect-[21/9] rounded-lg overflow-hidden">
            <Image
              src="/images/about-workshop.png"
              alt="Taller de costura artesanal de Cucú Becerra en la Ciudad de México"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionHeader
          title="Nuestros Valores"
          titleClassName={cormorant.className}
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {values.map((value) => (
            <div key={value.title} className="rounded-lg border border-border bg-white p-8">
              <h3 className={`${cormorant.className} text-xl font-semibold text-charcoal mb-3`}>
                {value.title}
              </h3>
              <p className="text-gray-warm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

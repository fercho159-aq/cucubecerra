import Image from 'next/image'
import SectionHeader from '@/components/ui/SectionHeader'

interface FeaturesProps {
  serifClassName?: string
}

const features = [
  {
    title: 'Hecho a Mano',
    description:
      'Cada pieza es confeccionada artesanalmente, cuidando cada puntada y detalle para crear una prenda única.',
    iconSrc: '/images/icon-hecho-a-mano.png',
    iconAlt: 'Icono hecho a mano',
  },
  {
    title: 'Materiales Finos',
    description:
      'Utilizamos telas de la más alta calidad: organza, seda, lino y encajes importados para cada creación.',
    iconSrc: '/images/icon-materiales-naturales.png',
    iconAlt: 'Icono materiales naturales',
  },
  {
    title: 'Tradición Mexicana',
    description:
      'Preservamos la tradición del bautizo mexicano con diseños que honran nuestras raíces y cultura.',
    iconSrc: '/images/icon-con-amor.png',
    iconAlt: 'Icono con amor',
  },
  {
    title: 'Envíos a Todo México',
    description:
      'Enviamos tu pedido a cualquier parte de la República Mexicana con empaque especial de regalo.',
    iconSrc: '/images/icon-calidad-premium.png',
    iconAlt: 'Icono calidad premium',
  },
]

export default function Features({ serifClassName = '' }: FeaturesProps) {
  return (
    <section className="bg-beige">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionHeader
          title="¿Por qué Cucú Becerra?"
          titleClassName={serifClassName}
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center rounded-lg bg-white p-8 shadow-sm"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 mb-5">
                <Image
                  src={feature.iconSrc}
                  alt={feature.iconAlt}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h3 className={`${serifClassName} text-lg font-semibold text-charcoal`}>
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-gray-warm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

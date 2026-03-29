import type { Metadata } from 'next'
import Image from 'next/image'
import { Cormorant_Garamond } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Cucú Becerra — Ropones y Trajes de Bautizo Artesanales',
  description: 'Tienda de ropa artesanal de bautizo en CDMX. Ropones y bombachos hechos a mano con telas finas.',
}
import { getCategories } from '@/actions/categories'
import Hero from '@/components/home/Hero'
import CategoryCards from '@/components/home/CategoryCards'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import Features from '@/components/home/Features'
import Button from '@/components/ui/Button'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <>
      <Hero serifClassName={cormorant.className} />
      <CategoryCards
        categories={categories}
        serifClassName={cormorant.className}
      />
      <FeaturedProducts serifClassName={cormorant.className} />

      {/* Hecho a mano banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[400px] md:h-[500px]">
          <Image
            src="/images/banner-hecho-a-mano.png"
            alt="Manos artesanas bordando un ropon de bautizo"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-charcoal/50" />
          <div className="relative flex h-full items-center justify-center text-center px-4">
            <div className="max-w-2xl">
              <h2 className={`${cormorant.className} text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight`}>
                Hecho a mano, con el corazón
              </h2>
              <p className="mt-4 text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
                Cada puntada refleja la dedicación de nuestras artesanas. Conoce el proceso detrás de cada prenda.
              </p>
              <div className="mt-8">
                <Button href="/nosotros" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal">
                  Conoce nuestra historia
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Features serifClassName={cormorant.className} />

      {/* Trust / Testimonials section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[350px] md:h-[450px]">
          <Image
            src="/images/testimonials-church.png"
            alt="Iglesia colonial donde se celebran bautizos"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/40 to-transparent" />
          <div className="relative flex h-full items-end justify-center pb-16 px-4">
            <div className="max-w-3xl text-center">
              <p className={`${cormorant.className} text-2xl md:text-3xl text-white font-semibold italic leading-relaxed`}>
                &ldquo;El ropón quedó hermoso, toda la familia quedó encantada. Se nota el amor en cada detalle.&rdquo;
              </p>
              <p className="mt-4 text-sm text-white/70 uppercase tracking-wider">
                — María G., Ciudad de México
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

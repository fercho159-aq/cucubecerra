// WARNING: Do NOT run in production
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { hashSync } from 'bcryptjs'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Categories (upsert by slug)
  const ropones = await prisma.category.upsert({
    where: { slug: 'ropones' },
    create: {
      name: 'Ropones',
      slug: 'ropones',
      gender: 'nina',
      description: 'Elegantes ropones de bautizo para nina',
    },
    update: {
      name: 'Ropones',
      gender: 'nina',
      description: 'Elegantes ropones de bautizo para nina',
    },
  })

  const bombachos = await prisma.category.upsert({
    where: { slug: 'bombachos' },
    create: {
      name: 'Bombachos',
      slug: 'bombachos',
      gender: 'nino',
      description: 'Trajes de bautizo para nino',
    },
    update: {
      name: 'Bombachos',
      gender: 'nino',
      description: 'Trajes de bautizo para nino',
    },
  })

  await prisma.category.upsert({
    where: { slug: 'accesorios' },
    create: {
      name: 'Accesorios',
      slug: 'accesorios',
      gender: 'unisex',
      description: 'Accesorios para la ceremonia',
    },
    update: {
      name: 'Accesorios',
      gender: 'unisex',
      description: 'Accesorios para la ceremonia',
    },
  })

  // Product 1: Bombacho Ceremonia Bruno BCU012
  const sizes = ['0-3m', '3-6m', '6-9m', '9-12m']
  const colors = ['Blanco', 'Marfil']

  await prisma.product.upsert({
    where: { sku: 'BCU012' },
    create: {
      sku: 'BCU012',
      name: 'Bombacho Ceremonia Bruno BCU012',
      slug: 'bombacho-ceremonia-bruno-bcu012',
      description:
        'Traje de bautizo hecho a mano con tela 100% Shantu Frances (disponible en Blanco o Marfil). Presenta adorno elegante en el pecho, mangas y parte baja del bombacho. Look clasico de manga corta con alforzas y detalles bordados. Incluye bombacho y gorra. Adornado con simbolos religiosos en la parte delantera de la capa. Interior forrado suavemente para no irritar al bebe.',
      price: 2290.0,
      categoryId: bombachos.id,
      featured: true,
      images: [],
      tags: ['bautizo', 'nino', 'hecho a mano', 'shantu frances', 'ceremonia'],
      variants: {
        create: colors.flatMap((color) =>
          sizes.map((size) => ({
            size,
            color,
            stock: 10,
          }))
        ),
      },
    },
    update: {
      name: 'Bombacho Ceremonia Bruno BCU012',
      description:
        'Traje de bautizo hecho a mano con tela 100% Shantu Frances (disponible en Blanco o Marfil). Presenta adorno elegante en el pecho, mangas y parte baja del bombacho. Look clasico de manga corta con alforzas y detalles bordados. Incluye bombacho y gorra. Adornado con simbolos religiosos en la parte delantera de la capa. Interior forrado suavemente para no irritar al bebe.',
      price: 2290.0,
      categoryId: bombachos.id,
      featured: true,
      tags: ['bautizo', 'nino', 'hecho a mano', 'shantu frances', 'ceremonia'],
    },
  })

  console.log('Upserted: Bombacho Ceremonia Bruno BCU012')

  // Product 2: Bombacho Ceremonia Lucas BCU013
  await prisma.product.upsert({
    where: { sku: 'BCU013' },
    create: {
      sku: 'BCU013',
      name: 'Bombacho Ceremonia Lucas BCU013',
      slug: 'bombacho-ceremonia-lucas-bcu013',
      description:
        'Traje de bautizo hecho a mano con tela 100% Shantu Frances color Marfil. Adorno elegante en pecho, mangas y parte baja. Manga corta con alforzas y detalles bordados. Incluye bombacho y gorra. Interior forrado suavemente. Elegante y comodo, brinda mayor movilidad que un ropon clasico.',
      price: 1290.0,
      categoryId: bombachos.id,
      featured: true,
      images: [],
      tags: ['bautizo', 'nino', 'hecho a mano', 'shantu frances', 'ceremonia', 'comodo'],
      variants: {
        create: sizes.map((size) => ({
          size,
          color: 'Marfil',
          stock: 10,
        })),
      },
    },
    update: {
      name: 'Bombacho Ceremonia Lucas BCU013',
      description:
        'Traje de bautizo hecho a mano con tela 100% Shantu Frances color Marfil. Adorno elegante en pecho, mangas y parte baja. Manga corta con alforzas y detalles bordados. Incluye bombacho y gorra. Interior forrado suavemente. Elegante y comodo, brinda mayor movilidad que un ropon clasico.',
      price: 1290.0,
      categoryId: bombachos.id,
      featured: true,
      tags: ['bautizo', 'nino', 'hecho a mano', 'shantu frances', 'ceremonia', 'comodo'],
    },
  })

  console.log('Upserted: Bombacho Ceremonia Lucas BCU013')

  // Product 3: Ropon Abril BCU05
  await prisma.product.upsert({
    where: { sku: 'BCU05' },
    create: {
      sku: 'BCU05',
      name: 'Ropon Abril BCU05',
      slug: 'ropon-abril-bcu05',
      description:
        'Elegante vestido largo de bautizo para nina, hecho a mano. Estilo europeo, extra largo, color marfil. Confeccionado con tejidos finos. Interior forrado suavemente para no irritar a la nina. Cuenta con aplique removible de flores y perlas elaborado artesanalmente. Una pieza para heredar a las generaciones venideras.',
      price: 3490.0,
      categoryId: ropones.id,
      featured: true,
      images: [],
      tags: ['bautizo', 'nina', 'hecho a mano', 'ropon', 'estilo europeo', 'herencia'],
      variants: {
        create: sizes.map((size) => ({
          size,
          stock: 10,
        })),
      },
    },
    update: {
      name: 'Ropon Abril BCU05',
      description:
        'Elegante vestido largo de bautizo para nina, hecho a mano. Estilo europeo, extra largo, color marfil. Confeccionado con tejidos finos. Interior forrado suavemente para no irritar a la nina. Cuenta con aplique removible de flores y perlas elaborado artesanalmente. Una pieza para heredar a las generaciones venideras.',
      price: 3490.0,
      categoryId: ropones.id,
      featured: true,
      tags: ['bautizo', 'nina', 'hecho a mano', 'ropon', 'estilo europeo', 'herencia'],
    },
  })

  console.log('Upserted: Ropon Abril BCU05')

  // Admin user (upsert by email)
  await prisma.adminUser.upsert({
    where: { email: 'admin@cucubecerra.com' },
    create: {
      email: 'admin@cucubecerra.com',
      passwordHash: hashSync('admin123', 10),
      name: 'Administrador',
    },
    update: {
      name: 'Administrador',
    },
  })

  console.log('Upserted: Admin user')
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const DEFAULT_CONFIG = {
  AVIRAL_SESSION: 'JAN-24'
}

async function main() {
  let configKeys = Object.keys(DEFAULT_CONFIG);
  for (let i = 0; i < configKeys.length; i++) { 
    const key = configKeys[i];
    let exists = await prisma.config.findFirst({
      where: {
        key
      }
    })
    if (!exists) {
      await prisma.config.create({
        data: {
          key,
          value: DEFAULT_CONFIG[key]
        }
      })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
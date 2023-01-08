import { PrismaClient } from '@prisma/client'

// Defines prisma globally to not exhaust multiple connections to the datbase
// See https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined
}

const prisma =
  global.prisma || new PrismaClient({ log: ['info', 'warn', 'error'] })

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma

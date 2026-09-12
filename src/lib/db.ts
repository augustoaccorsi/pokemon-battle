import { PrismaClient } from '@prisma/client'

// Prevent multiple Prisma Client instances in development (HMR)
declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined
}

export const db: PrismaClient =
  globalThis._prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis._prisma = db
}

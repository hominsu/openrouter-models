/**
 * Convenience singleton to deal with fast-refresh
 * and connection limits in development mode.
 */
import type { PrismaDbMain as Prisma, PrismaClientDbMain as PrismaClient } from './index'
export type PrismaClientOptions = Prisma.PrismaClientOptions

declare const globalThis: {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __PRISMA_INSTANCES__: Record<string, PrismaClient> | undefined
} & typeof global

export class PrismaManager {
  private static instances?: Record<string, PrismaClient>
  private constructor() {}

  /**
   * Create and maintain a prismaClient instance that avoids issues with
   * db connections limit exhaustion in dev mode.
   *
   * In dev mode the prisma instance is kept unique by using a `global` reference
   * preventing issues with Fast-Refresh / Hot-Module-Replacement (HMR) strategies
   *
   * @see {@link https://pris.ly/d/help/next-js-best-practices|Prisma NextJs Best Practices}
   */
  static getInstance(instanceKey: string, prismaClientFactory: () => PrismaClient): PrismaClient {
    if (process.env.NODE_ENV === 'production') {
      if (!PrismaManager.instances?.[instanceKey]) {
        PrismaManager.instances ??= {}
        PrismaManager.instances[instanceKey] = prismaClientFactory()
      }
      return PrismaManager.instances[instanceKey]
    } else {
      // PrismaClient is attached to the `global` object in development to prevent
      // exhausting your database connection limit.
      if (!globalThis.__PRISMA_INSTANCES__?.[instanceKey]) {
        globalThis.__PRISMA_INSTANCES__ ??= {}
        globalThis.__PRISMA_INSTANCES__[instanceKey] = prismaClientFactory()
        console.debug(
          '[PrismaFactory.createDevSafeInstance]: Dev instance created and preserved globally.'
        )
      }
      return globalThis.__PRISMA_INSTANCES__[instanceKey]
    }
  }
}

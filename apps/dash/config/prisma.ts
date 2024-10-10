import { PrismaD1, PrismaManager, PrismaClientDbMain } from '@openrouter-models/db'

export const getPrismaClient = (env: CloudflareEnv): PrismaClientDbMain => {
  return PrismaManager.getInstance('db', () => {
    const adapter = new PrismaD1(env.DB)
    const client = new PrismaClientDbMain({ adapter })
    return client
  })
}

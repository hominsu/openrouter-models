import { PrismaD1, PrismaManager, PrismaClientDbMain } from '@openrouter-models/db'

export const getPrismaClient: (env: Env) => PrismaClientDbMain = (env: Env) => {
  return PrismaManager.getInstance('db', () => {
    const adapter = new PrismaD1(env.DB)
    const client = new PrismaClientDbMain({ adapter })
    return client
  })
}

/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { getPrismaClient } from '@/config/prisma'
import type { Parameters, Model } from 'schema'

async function getModels(env: Env) {
  const fetchModelParameters = async (id: string) => {
    return fetch(`https://openrouter.ai/api/v1/parameters/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENER_ROUTER_API_KEY}`,
      },
    })
      .then((res) => res.json<{ data: Parameters }>())
      .then((json) => json.data)
      .catch((err) => {
        console.log(`Error fetching parameters for model ID ${id}:`, err)
        return null
      })
  }

  const fetchModels = async () => {
    return fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENER_ROUTER_API_KEY}`,
      },
    })
      .then((res) => res.json<{ data: Model[] }>())
      .then((json) => json.data)
      .then((models) => {
        return Promise.all(
          models.map(async (model) => {
            return fetchModelParameters(model.id).then((parameters) => ({
              ...model,
              parameters,
            }))
          })
        )
      })
      .catch((err) => {
        console.error('Error fetching models:', err)
        return null
      })
  }

  return fetchModels()
}

async function update(env: Env) {
  const client = getPrismaClient(env)
  const current_time = new Date(Date.now())

  try {
    const models = await getModels(env)
    if (!models) {
      return
    }

    await client.model.deleteMany({
      where: {
        createdAt: {
          lt: current_time,
        },
      },
    })

    await Promise.all(
      models.map((model) => {
        return client.model.create({
          data: {
            id: model.id,
            name: model.name,
            created: new Date(model.created),
            description: model.description,
            context_length: model.context_length,
            architecture: { create: { ...model.architecture } },
            pricing: { create: { ...model.pricing } },
            top_provider: { create: { ...model.top_provider } },
            per_request_limits: { create: { ...model.per_request_limits } },
            parameters: {
              create: {
                ...model.parameters,
                supported_parameters: model.parameters?.supported_parameters?.length
                  ? {
                      createMany: {
                        data: model.parameters.supported_parameters.map((param) => ({
                          name: param,
                        })),
                      },
                    }
                  : undefined,
              },
            },
            createdAt: current_time,
          },
          include: {
            architecture: true,
            pricing: true,
            top_provider: true,
            per_request_limits: true,
            parameters: { include: { supported_parameters: true } },
          },
        })
      })
    )
  } catch (err) {
    console.error('Error updating models:', err)
  }
}

export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(update(env))
  },
} satisfies ExportedHandler<Env>

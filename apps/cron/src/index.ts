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

import type { CompleteModel, CompleteParameters } from '@openrouter-models/db'

async function getModels(env: Env) {
  const fetchModelParameters = async (id: string) => {
    return fetch(`https://openrouter.ai/api/v1/parameters/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENER_ROUTER_API_KEY}`,
      },
    })
      .then((res) => res.json<{ data: CompleteParameters }>())
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
      .then((res) => res.json<{ data: CompleteModel[] }>())
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

  const models = await fetchModels()
  console.log('models:', models)
}

// async function update(env: Env) {
//   const models = await getModels(env)
//   const client = getPrismaClient(env)

//   try {
//     await client.model.deleteMany({})
//   } catch (err) {}
// }

export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(getModels(env))
  },
} satisfies ExportedHandler<Env>

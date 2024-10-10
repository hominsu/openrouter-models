import type {
  Architecture as ArchitectureSchema,
  Pricing as PricingSchema,
  TopProvider as TopProviderSchema,
  PerRequestLimits as PerRequestLimitsSchema,
  Parameters as ParametersSchema,
  Model as ModelSchema,
} from '@openrouter-models/db'

import type { z } from 'zod'

type Architecture = z.infer<typeof ArchitectureSchema>
type Pricing = z.infer<typeof PricingSchema>
type TopProvider = z.infer<typeof TopProviderSchema>
type PerRequestLimits = z.infer<typeof PerRequestLimitsSchema>
type Parameters = z.infer<typeof ParametersSchema> & {
  supported_parameters?: string[]
}
type Model = z.infer<typeof ModelSchema> & {
  architecture?: Architecture | null
  pricing?: Pricing | null
  top_provider?: TopProvider | null
  per_request_limits?: PerRequestLimits | null
  parameters?: Parameters | null
}

export type { Architecture, Pricing, TopProvider, PerRequestLimits, Parameters, Model }

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Variáveis de ambiente não puderam ser validadas.', _env.error.format())
  throw new Error('Variáveis de ambiente não puderam ser validadas.')
}

export const env = _env.data
import fastify from 'fastify'
import { Routes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(Routes.auth, {
  prefix: '/auth',
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação',
      issues: error.errors.map((err) => {
        return {
          path: err.path[0],
          message: err.message,
        }
      }),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Erro no servidor interno.' })
})

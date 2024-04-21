import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials.error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export class AuthenticateController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    const authenticateSchema = z.object({
      email: z
        .string({
          required_error: 'E-mail é obrigatório.',
        })
        .email({
          message: 'E-mail inválido.',
        }),
      password: z
        .string({
          required_error: 'Senha é obrigatória.',
        })
        .min(6, { message: 'Senha deve ter no mínimo 6 caractéres.' }),
    })
    const body = authenticateSchema.parse(request.body)

    try {
      const authenticateUseCase = makeAuthenticateUseCase()

      const { user } = await authenticateUseCase.execute(body)

      return reply.status(200).send({
        id: user.id,
        email: user.email,
        name: user.name,
      })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(401).send({ emssage: error.message })
      }

      throw error
    }
  }
}

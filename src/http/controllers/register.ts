import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists.error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export class RegisterController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    const registerSchema = z.object({
      name: z
        .string({
          required_error: 'Nome é obrigatório.',
        })
        .min(6, { message: 'Nome deve ter no mínimo 6 caractéres.' }),
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
    const body = registerSchema.parse(request.body)

    try {
      const registerUserUseCase = makeRegisterUseCase()

      await registerUserUseCase.execute(body)
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return reply.status(409).send({ emssage: error.message })
      }

      throw error
    }
    return reply.status(201).send()
  }
}

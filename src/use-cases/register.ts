import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcrypt'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'
import { User } from '@prisma/client'

interface RegisterUserRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(data: RegisterUserRequest): Promise<RegisterUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(data.email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      password_hash: await hash(data.password, 6),
      email: data.email,
      name: data.name,
    })

    return { user }
  }
}

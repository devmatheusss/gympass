import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { prisma } from '@/lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
  async create({ email, name, password_hash }: Prisma.UserCreateInput) {
    const newUser = prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    })

    return newUser
  }

  async findByEmail(email: string) {
    const user = prisma.user.findUnique({
      where: { email },
    })
    return user
  }

  async findById(id: string) {
    const user = prisma.user.findUnique({
      where: { id },
    })
    return user
  }
}

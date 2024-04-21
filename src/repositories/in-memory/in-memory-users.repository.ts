import { randomUUID } from 'node:crypto'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const id = randomUUID()

    this.users.push({
      id,
      created_at: new Date(),
      ...data,
    })

    const user = this.users.filter((usr) => usr.id === id)

    return user[0]
  }

  async findByEmail(email: string) {
    const user = this.users.find((usr) => usr.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string) {
    const user = this.users.find((usr) => usr.id === id)

    if (!user) {
      return null
    }

    return user
  }
}

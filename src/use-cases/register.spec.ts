import { beforeEach, describe, expect, it } from 'vitest'
import { compare } from 'bcrypt'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'user',
      email: 'user@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to register the same user twice', async () => {
    const email = 'user@email.com'

    await sut.execute({
      email,
      name: 'user',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        email,
        name: 'user',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should hash the password', async () => {
    const password = '123456'

    const { user } = await sut.execute({
      name: 'user',
      email: 'user@email.com',
      password,
    })

    const isPassowrdHashed = await compare(password, user.password_hash)

    expect(isPassowrdHashed).toBe(true)
  })
})

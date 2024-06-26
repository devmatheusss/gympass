import { randomUUID } from 'node:crypto'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { isSameDay } from 'date-fns'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.checkIns.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(
      (item) => item.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkIn
    }

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkInOnSameDay = this.checkIns.find((checkIn) => {
      return checkIn.user_id === userId && isSameDay(checkIn.created_at, date)
    })

    if (!checkInOnSameDay) {
      return null
    }

    return checkInOnSameDay
  }

  async findById(id: string) {
    const checkIn = this.checkIns.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }

  async countByUserId(userId: string) {
    const checkInsCount = this.checkIns.filter(
      (checkIn) => checkIn.user_id === userId,
    ).length

    return checkInsCount
  }
}

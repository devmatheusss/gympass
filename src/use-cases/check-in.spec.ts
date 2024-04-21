import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.error'
import { MaxDistanceError } from './errors/max-distance.error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      latitude: -11.5057341,
      longitude: -63.580611,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -11.5057341,
      userLongitude: -63.580611,
    })

    expect(checkIn.id).not.toBe('undefined')
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 1))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -11.5057341,
      userLongitude: -63.580611,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -11.5057341,
        userLongitude: -63.580611,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 1))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -11.5057341,
      userLongitude: -63.580611,
    })

    vi.setSystemTime(new Date(2024, 0, 2))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -11.5057341,
      userLongitude: -63.580611,
    })

    expect(checkIn.id).not.toBe('undefined')
  })

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'JavaScript Gym',
      latitude: -11.5057341,
      longitude: -63.580611,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -11.6143351,
        userLongitude: -63.724121,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

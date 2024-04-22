import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InvalidPageError } from './errors/invalid-page.error'

interface SearchGymsUseCaseRequest {
  query: string
  page?: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page = 1,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    if (page <= 0) {
      throw new InvalidPageError()
    }

    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}

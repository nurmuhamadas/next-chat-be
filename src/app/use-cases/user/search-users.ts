import { inject, injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchUserEntity } from "@/domains/users/entities/search-user-entity"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class SearchUsers {
  constructor(
    @inject(KEYS.ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {}

  async execute({
    userId,
    query,
    limit,
    cursor,
  }: {
    userId: string
    query?: string
    limit?: number
    cursor?: string
  }): Promise<{
    data: SearchUserEntity[]
    total: number
    cursor?: string
  }> {
    const params = new SearchParamsEntity(query, cursor, limit)

    const result = await this.profileRepository.searchUsers(userId, params)

    return result
  }
}

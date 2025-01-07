import { inject, injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchUserForMemberEntity } from "@/domains/users/entities/search-user-for-member-entity"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class SearchUsersForMember {
  constructor(
    @inject(KEYS.ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {}

  async execute({
    userId,
    groupId,
    query,
    limit,
    cursor,
  }: {
    userId: string
    groupId: string
    query?: string
    limit?: number
    cursor?: string
  }): Promise<{
    data: SearchUserForMemberEntity[]
    total: number
    cursor?: string
  }> {
    const params = new SearchParamsEntity(query, cursor, limit)

    const result = await this.profileRepository.searchForMember(
      userId,
      groupId,
      params,
    )

    return result
  }
}

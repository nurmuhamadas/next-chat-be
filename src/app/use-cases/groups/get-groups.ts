import { inject, injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { GroupEntity } from "@/domains/groups/entities/group-entity"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetGroups {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<GroupEntity>> {
    return this.groupRepository.getGroups(session.userId, params)
  }
}

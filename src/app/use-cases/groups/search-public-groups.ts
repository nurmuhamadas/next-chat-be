import { inject, injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class SearchPublicGroups {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
  ) {}

  async execute(session: SessionTokenEntity, params: SearchParamsEntity) {
    return this.groupRepository.searchPublicGroups(session.userId, params)
  }
}

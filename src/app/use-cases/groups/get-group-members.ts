import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { GroupMemberEntity } from "@/domains/groups/entities/group-member-entity"
import { GroupMemberRepository } from "@/domains/groups/repositories/group-member-repository"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetGroupMembers {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
    @inject(KEYS.GroupMemberRepository)
    private groupMemberRepository: GroupMemberRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    groupId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<GroupMemberEntity>> {
    const group = await this.groupRepository.getPublicOrJoinedGroupById(
      groupId,
      session.userId,
    )

    if (!group) {
      throw new NotFoundError(ERROR.GROUP_NOT_FOUND)
    }

    return this.groupMemberRepository.getMembers(groupId, params)
  }
}

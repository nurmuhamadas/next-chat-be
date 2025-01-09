import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { GroupOptionEntity } from "@/domains/groups/entities/group-option-entity"
import { UpdateGroupOptionEntity } from "@/domains/groups/entities/update-group-option-entity"
import { GroupOptionRepository } from "@/domains/groups/repositories/group-option-repository"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetGroupOption {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
    @inject(KEYS.GroupOptionRepository)
    private groupOptionRepository: GroupOptionRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    groupId: string,
  ): Promise<GroupOptionEntity> {
    const group = await this.groupRepository.getPublicOrJoinedGroupById(
      groupId,
      session.userId,
    )

    if (!group) {
      throw new NotFoundError(ERROR.GROUP_NOT_FOUND)
    }

    if (!group.isMember) {
      throw new AuthorizationError(ERROR.NOT_GROUP_MEMBER)
    }

    const groupOption = await this.groupOptionRepository.getOption(
      groupId,
      session.userId,
    )
    if (!groupOption) {
      const data = new UpdateGroupOptionEntity(groupId, session.userId, true)
      const option = await this.groupOptionRepository.createOrUpdateOption(data)

      return option
    }

    return groupOption
  }
}

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
export class UpdateGroupOption {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
    @inject(KEYS.GroupOptionRepository)
    private groupOptionRepository: GroupOptionRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    data: UpdateGroupOptionEntity,
  ): Promise<GroupOptionEntity> {
    const group = await this.groupRepository.getPublicOrJoinedGroupById(
      data.groupId,
      session.userId,
    )

    if (!group) {
      throw new NotFoundError(ERROR.GROUP_NOT_FOUND)
    }

    if (!group.isMember) {
      throw new AuthorizationError(ERROR.NOT_GROUP_MEMBER)
    }

    const groupOption = await this.groupOptionRepository.getOption(
      data.groupId,
      session.userId,
    )
    const option = await this.groupOptionRepository.createOrUpdateOption(
      data,
      groupOption?.id,
    )

    return option
  }
}

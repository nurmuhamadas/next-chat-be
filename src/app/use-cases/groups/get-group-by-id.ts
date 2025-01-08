import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { GroupEntity } from "@/domains/groups/entities/group-entity"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetGroupById {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    groupId: string,
  ): Promise<GroupEntity> {
    const group =
      await this.groupRepository.getPublicOrJoinedGroupByIdIncludeDeleted(
        groupId,
        session.userId,
      )

    if (!group) {
      throw new NotFoundError(ERROR.GROUP_NOT_FOUND)
    }

    if (group.isDeleted) {
      return group.deletedGroup
    }

    return group
  }
}

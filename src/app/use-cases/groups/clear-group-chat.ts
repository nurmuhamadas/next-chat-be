import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { GroupOptionRepository } from "@/domains/groups/repositories/group-option-repository"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class ClearGroupChat {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
    @inject(KEYS.GroupOptionRepository)
    private groupOptionRepository: GroupOptionRepository,
  ) {}

  async execute(session: SessionTokenEntity, groupId: string): Promise<void> {
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

    await this.groupOptionRepository.clearAllChats(
      groupId,
      session.userId,
      group.isAdmin,
    )
  }
}

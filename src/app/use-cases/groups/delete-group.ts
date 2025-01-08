import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class DeleteGroup {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
  ) {}

  async execute(session: SessionTokenEntity, groupId: string): Promise<void> {
    const currentGroup = await this.groupRepository.getGroupById(
      groupId,
      session.userId,
    )

    if (!currentGroup) {
      throw new NotFoundError(ERROR.GROUP_NOT_FOUND)
    }

    if (!currentGroup.isAdmin) {
      throw new AuthorizationError(ERROR.UNAUTHORIZE)
    }

    await this.groupRepository.softDeleteGroup(groupId)
  }
}

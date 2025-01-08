import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { GroupMemberRepository } from "@/domains/groups/repositories/group-member-repository"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class RemoveGroupAdmin {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
    @inject(KEYS.GroupMemberRepository)
    private groupMemberRepository: GroupMemberRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    groupId: string,
    addedUserId: string,
  ) {
    const group = await this.groupRepository.getPublicOrJoinedGroupById(
      groupId,
      session.userId,
    )

    if (!group) {
      throw new NotFoundError(ERROR.GROUP_NOT_FOUND)
    }

    if (!group.isAdmin) {
      throw new AuthorizationError(ERROR.ONLY_ADMIN_CAN_REMOVE_ADMIN)
    }

    const isMember = await this.groupMemberRepository.validateUserInGroup(
      groupId,
      addedUserId,
    )

    if (!isMember) {
      throw new InvariantError(ERROR.USER_IS_NOT_MEMBER)
    }

    const isAdmin = await this.groupMemberRepository.validateGroupAdmin(
      groupId,
      addedUserId,
    )

    if (!isAdmin) {
      throw new InvariantError(ERROR.USER_IS_NOT_ADMIN)
    }

    await this.groupMemberRepository.removeAdmin(groupId, addedUserId)
  }
}

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
export class DeleteGroupMember {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
    @inject(KEYS.GroupMemberRepository)
    private groupMemberRepository: GroupMemberRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    groupId: string,
    removedUserId: string,
  ) {
    const group = await this.groupRepository.getPublicOrJoinedGroupById(
      groupId,
      session.userId,
    )

    if (!group) {
      throw new NotFoundError(ERROR.GROUP_NOT_FOUND)
    }

    if (!group.isAdmin) {
      throw new AuthorizationError(ERROR.ONLY_ADMIN_REMOVE_MEMBER)
    }

    const isMember = await this.groupMemberRepository.validateUserInGroup(
      groupId,
      removedUserId,
    )

    if (!isMember) {
      throw new InvariantError(ERROR.REMOVED_USER_IS_NOT_MEMBER)
    }

    await this.groupMemberRepository.leaveGroup(groupId, removedUserId)
  }
}

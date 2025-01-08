import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { BlockedUserRepository } from "@/domains/blocked-users/repositories/blocked-user-repository"
import { GroupMemberRepository } from "@/domains/groups/repositories/group-member-repository"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class AddGroupMember {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
    @inject(KEYS.GroupMemberRepository)
    private groupMemberRepository: GroupMemberRepository,
    @inject(KEYS.BlockedUserRepository)
    private blockedUserRepository: BlockedUserRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    groupId: string,
    addedUserId: string,
  ) {
    const group = await this.groupRepository.getGroupById(
      groupId,
      session.userId,
    )

    if (!group) {
      throw new NotFoundError(ERROR.GROUP_NOT_FOUND)
    }

    if (!group.isAdmin) {
      throw new AuthorizationError(ERROR.ONLY_ADMIN_ADD_MEMBER)
    }

    const isMember = await this.groupMemberRepository.validateUserInGroup(
      groupId,
      addedUserId,
    )

    if (isMember) {
      throw new InvariantError(ERROR.ADDED_USER_ALREADY_MEMBER)
    }

    const isBlockedByUser = await this.blockedUserRepository.getIsUserBlocked(
      addedUserId,
      session.userId,
    )

    if (isBlockedByUser) {
      throw new NotFoundError(ERROR.CANNOT_ADD_USER_IF_BLOCKED)
    }

    const isBlockingAddedUser =
      await this.blockedUserRepository.getIsUserBlocked(
        session.userId,
        addedUserId,
      )

    if (isBlockingAddedUser) {
      throw new AuthorizationError(ERROR.ADD_BLOCKED_USERS_NOT_ALLOWED)
    }

    await this.groupMemberRepository.joinGroup(groupId, addedUserId)
  }
}

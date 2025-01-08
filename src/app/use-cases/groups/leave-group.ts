import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { GroupMemberRepository } from "@/domains/groups/repositories/group-member-repository"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class LeaveGroup {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
    @inject(KEYS.GroupMemberRepository)
    private groupMemberRepository: GroupMemberRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    groupId: string,
    code?: string,
  ): Promise<void> {
    const group = await this.groupRepository.getGeneralGroupById(
      groupId,
      session.userId,
    )

    if (!group) {
      throw new NotFoundError(ERROR.GROUP_NOT_FOUND)
    }

    if (!group.isMember) {
      throw new InvariantError(ERROR.NOT_GROUP_MEMBER)
    }

    if (group.type === "PRIVATE" && group.inviteCode !== code) {
      throw new InvariantError(ERROR.INVALID_JOIN_CODE)
    }

    if (group.totalMembers === 1) {
      await this.groupRepository.softDeleteGroup(groupId)
    }

    const totalAdmins = await this.groupMemberRepository.getTotalAdmins(groupId)

    const isOnlyOneAdmin = group.isAdmin && totalAdmins === 1
    if (isOnlyOneAdmin) {
      const members = await this.groupMemberRepository.getMembers(groupId, {
        limit: 2,
      })
      const otherMember = members.data.find(
        (member) => member.id !== session.userId,
      )

      if (otherMember) {
        await this.groupMemberRepository.addAdmin(groupId, otherMember.id)
      }
    }

    await this.groupMemberRepository.leaveGroup(groupId, session.userId)
  }
}

import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { GroupMemberRepository } from "@/domains/groups/repositories/group-member-repository"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class JoinGroup {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
    @inject(KEYS.GroupMemberRepository)
    private groupMemberRepository: GroupMemberRepository,
  ) {}

  async execute(session: SessionTokenEntity, groupId: string, code?: string) {
    const group = await this.groupRepository.getGeneralGroupById(
      groupId,
      session.userId,
    )

    if (!group) {
      throw new NotFoundError(ERROR.GROUP_NOT_FOUND)
    }

    if (group.isMember) {
      throw new InvariantError(ERROR.ALREADY_MEMBER)
    }

    if (group.type === "PRIVATE" && group.inviteCode !== code) {
      throw new InvariantError(ERROR.INVALID_JOIN_CODE)
    }

    await this.groupMemberRepository.joinGroup(groupId, session.userId)
  }
}

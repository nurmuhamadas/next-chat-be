import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { BlockedUserRepository } from "@/domains/blocked-users/repositories/blocked-user-repository"
import { CreateGroupEntity } from "@/domains/groups/entities/create-group-entity"
import { GroupEntity } from "@/domains/groups/entities/group-entity"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class CreateGroup {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
    @inject(KEYS.ProfileRepository)
    private profileRepository: ProfileRepository,
    @inject(KEYS.BlockedUserRepository)
    private blockedUserRepository: BlockedUserRepository,
    @inject(KEYS.StorageRepository)
    private storageRepository: StorageRepository,
  ) {}

  private async validateGroupMember(
    userId: string,
    memberIds: string[],
  ): Promise<void> {
    // USER SHOULD ADD REGISTERED USER ONLY
    const validProfiles =
      await this.profileRepository.findProfileUserIdsByUserIdsExceptUserId(
        memberIds,
        userId,
      )

    if (validProfiles.length < memberIds.length) {
      const validUserIds = validProfiles.map((v) => v.userId)
      const notValidUserId = memberIds.find((id) => !validUserIds.includes(id))

      throw new InvariantError(ERROR.MEMBER_ID_NOT_FOUND, [
        "members",
        notValidUserId!,
      ])
    }

    // USER SHOULD NOT ADD BLOCKED USER AS MEMBER
    const blockedUsers =
      await this.blockedUserRepository.getBlockedUserIdsByUserIds(
        userId,
        memberIds,
      )
    if (blockedUsers.length > 0) {
      const blockedUserIds = blockedUsers.map((v) => v.blockedUserId)
      const blockedUserId = memberIds.find((id) => blockedUserIds.includes(id))
      throw new InvariantError(ERROR.ADD_BLOCKED_USERS_NOT_ALLOWED, [
        "members",
        blockedUserId!,
      ])
    }

    // USER SHOULD NOT ADD BLOCKED USER AS MEMBER
    const blockedByUsers =
      await this.blockedUserRepository.getBlockedByUserIdsByUserIds(
        userId,
        memberIds,
      )
    if (blockedByUsers.length > 0) {
      const blockedByUserIds = blockedUsers.map((v) => v.blockedUserId)
      const blockedByUserId = memberIds.find((id) =>
        blockedByUserIds.includes(id),
      )
      throw new InvariantError(ERROR.ADDDED_BY_BLOCKED_USER_NOT_ALLOWED, [
        "members",
        blockedByUserId!,
      ])
    }

    return undefined
  }

  async execute(
    session: SessionTokenEntity,
    data: CreateGroupEntity,
    imageFile?: File,
  ): Promise<GroupEntity> {
    const isNameAvailable =
      await this.groupRepository.checkGroupNameAvailability(
        session.userId,
        data.name,
      )
    if (!isNameAvailable) {
      throw new InvariantError(ERROR.GROUP_NAME_DUPLICATED)
    }

    await this.validateGroupMember(session.userId, data.memberIds)

    let fileId: string | undefined
    if (imageFile) {
      const file = await this.storageRepository.uploadFile(imageFile)
      fileId = file.id
      data.imageUrl = file.url
    }

    try {
      const result = await this.groupRepository.createGroup(data)

      return result
    } catch (e) {
      if (fileId) {
        await this.storageRepository.deleteFile(fileId)
      }
      throw e
    }
  }
}

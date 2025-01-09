import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { BlockedUserRepository } from "@/domains/blocked-users/repositories/blocked-user-repository"
import { GroupEntity } from "@/domains/groups/entities/group-entity"
import { UpdateGroupEntity } from "@/domains/groups/entities/update-group-entity"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class UpdateGroup {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
    @inject(KEYS.ProfileRepository)
    private profileRepository: ProfileRepository,
    @inject(KEYS.BlockedUserRepository)
    private blockedUserRepository: BlockedUserRepository,
    @inject(KEYS.StorageRepository)
    private storageRepository: StorageRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    data: UpdateGroupEntity,
    imageFile?: File,
  ): Promise<GroupEntity> {
    const currentGroup = await this.groupRepository.getPublicOrJoinedGroupById(
      data.id,
      session.userId,
    )

    if (!currentGroup) {
      throw new NotFoundError(ERROR.GROUP_NOT_FOUND)
    }

    if (!currentGroup.isAdmin) {
      throw new AuthorizationError(ERROR.UNAUTHORIZE)
    }

    if (data.name && data.name !== currentGroup.name) {
      const isNameAvailable =
        await this.groupRepository.checkGroupNameAvailability(
          session.userId,
          data.name,
        )

      if (!isNameAvailable) {
        throw new InvariantError(ERROR.GROUP_NAME_DUPLICATED)
      }
    }

    let fileId: string | undefined
    if (imageFile) {
      const file = await this.storageRepository.uploadFile(imageFile)
      fileId = file.id
      data.imageUrl = file.url
    }

    try {
      const result = await this.groupRepository.updateGroup(
        session.userId,
        data,
      )

      // DELETE OLD IMAGE IF NEW IMAGE UPLOADED
      if (fileId && currentGroup.imageUrl) {
        await this.storageRepository.deleteFileByUrl(currentGroup.imageUrl)
      }

      return result
    } catch {
      if (fileId) {
        await this.storageRepository.deleteFile(fileId)
      }
      throw new Error(ERROR.INTERNAL_SERVER_ERROR)
    }
  }
}

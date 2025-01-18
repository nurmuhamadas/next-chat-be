import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { PrivateChatOptionEntity } from "@/domains/private-chat/entites/private-chat-option-entity"
import { PrivateChatOptionRepository } from "@/domains/private-chat/repositories/private-chat-option-repository"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class ClearChat {
  constructor(
    @inject(KEYS.PrivateChatOptionRepository)
    private privateChatOptionRepositor: PrivateChatOptionRepository,
    @inject(KEYS.ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    userId: string,
  ): Promise<PrivateChatOptionEntity> {
    const user = await this.profileRepository.findProfileByUserId(userId)

    if (!user) {
      throw new NotFoundError(ERROR.USER_NOT_FOUND)
    }

    const currentOption =
      await this.privateChatOptionRepositor.getPrivateChatOptionByUserId(
        session.userId,
        userId,
      )

    if (!currentOption) {
      throw new NotFoundError(ERROR.PRIVATE_CHAT_OPTION_NOT_FOUND)
    }

    const result =
      await this.privateChatOptionRepositor.clearAllOptionAndCreateNewOne(
        currentOption,
      )

    return result
  }
}

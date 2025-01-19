import { inject, injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { BlockedUserRepository } from "@/domains/blocked-users/repositories/blocked-user-repository"
import { ChannelSubscriberRepository } from "@/domains/channels/repositories/channel-subscriber-repository"
import { GroupMemberRepository } from "@/domains/groups/repositories/group-member-repository"
import { MessageEntity } from "@/domains/messages/entities/message-entity"
import { MessageRepository } from "@/domains/messages/repositories/message-repository"
import { PrivateChatOptionRepository } from "@/domains/private-chat/repositories/private-chat-option-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetMessages {
  constructor(
    @inject(KEYS.MessageRepository)
    private messageRepository: MessageRepository,
    @inject(KEYS.PrivateChatOptionRepository)
    private privateChatOptionRepository: PrivateChatOptionRepository,
    @inject(KEYS.BlockedUserRepository)
    private blockedUserRepository: BlockedUserRepository,
    @inject(KEYS.GroupMemberRepository)
    private groupMemberRepository: GroupMemberRepository,
    @inject(KEYS.ChannelSubscriberRepository)
    private channelSubscriberRepository: ChannelSubscriberRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    receiverId: string,
    roomType: RoomType,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<MessageEntity>> {
    if (roomType === "PRIVATE") {
      const optionsHistory =
        await this.privateChatOptionRepository.getOptionsHistory(
          session.userId,
          receiverId,
        )

      const blockedHistory = await this.blockedUserRepository.getBlockedHistory(
        session.userId,
        receiverId,
      )

      const result = await this.messageRepository.getPrivateMessages(
        session.userId,
        receiverId,
        optionsHistory,
        blockedHistory,
        params,
      )

      return result
    } else if (roomType === "GROUP") {
      const memberHistory = await this.groupMemberRepository.getMemberHistory(
        receiverId,
        session.userId,
      )

      const result = await this.messageRepository.getGroupMessages(
        session.userId,
        receiverId,
        memberHistory,
        params,
      )

      return result
    } else {
      const subscriberHistory =
        await this.channelSubscriberRepository.getSubscriberHistory(
          receiverId,
          session.userId,
        )

      const result = await this.messageRepository.getChannelMessages(
        session.userId,
        receiverId,
        subscriberHistory,
        params,
      )

      return result
    }
  }
}

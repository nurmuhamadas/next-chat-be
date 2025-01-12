import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { BlockedUserEntity } from "@/domains/blocked-users/entities/blocked-user-entity"
import { ChannelSubscriberEntity } from "@/domains/channels/entities/channel-subscriber-entity"
import { GroupMemberEntity } from "@/domains/groups/entities/group-member-entity"
import { PrivateChatOptionEntity } from "@/domains/private-chat/entites/private-chat-option-entity"

import { CreateMessageEntity } from "../entities/create-message-entity"
import { MessageEntity } from "../entities/message-entity"
import { UpdateMessageEntity } from "../entities/update-message-entity"

export abstract class MessageRepository {
  abstract getMessageById(messageId: string): Promise<MessageEntity | null>

  abstract createMessage(
    userId: string,
    data: CreateMessageEntity,
    parentMessage: MessageEntity,
  ): Promise<MessageEntity>

  abstract getPrivateMessages(
    userId: string,
    receiverId: string,
    chatOptionHistory: PrivateChatOptionEntity[],
    blockedHistory: BlockedUserEntity[],
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<MessageEntity>>

  abstract getGroupMessages(
    groupId: string,
    memberHistory: GroupMemberEntity[],
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<MessageEntity>>

  abstract getChannelMessages(
    channelId: string,
    subsHistory: ChannelSubscriberEntity[],
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<MessageEntity>>

  abstract updateMessage(
    messageId: string,
    data: UpdateMessageEntity,
  ): Promise<MessageEntity>

  abstract deleteMessage(messageId: string): Promise<void>

  abstract deleteMessageForAll(messageId: string): Promise<void>

  abstract deleteMessageByAdmin(messageId: string): Promise<void>
}

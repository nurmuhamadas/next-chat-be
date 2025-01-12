import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { CreateMessageEntity } from "../entities/create-message-entity"
import { MessageEntity } from "../entities/message-entity"
import { UpdateMessageEntity } from "../entities/update-message-entity"

export abstract class MessageRepository {
  abstract validatePrivateMessage(
    userId: string,
    receiverId: string,
  ): Promise<void>

  abstract validateGroupMessage(userId: string, groupId: string): Promise<void>

  abstract validateChannelMessage(
    userId: string,
    channelId: string,
  ): Promise<void>

  abstract createMessage(
    userId: string,
    data: CreateMessageEntity,
  ): Promise<MessageEntity>

  abstract getPrivateMessages(
    userId: string,
    receiverId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<MessageEntity>>

  abstract getGroupMessages(
    userId: string,
    groupId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<MessageEntity>>

  abstract getChannelMessages(
    userId: string,
    channelId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<MessageEntity>>

  abstract updateMessage(
    userId: string,
    data: UpdateMessageEntity,
  ): Promise<MessageEntity>

  abstract deleteMessage(userId: string, messageId: string): Promise<void>

  abstract deleteMessageForAll(userId: string, messageId: string): Promise<void>

  abstract deleteMessageByAdmin(
    userId: string,
    messageId: string,
  ): Promise<void>
}

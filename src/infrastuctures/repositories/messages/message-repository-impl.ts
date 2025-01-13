import { injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { BlockedUserEntity } from "@/domains/blocked-users/entities/blocked-user-entity"
import { ChannelSubscriberEntity } from "@/domains/channels/entities/channel-subscriber-entity"
import { GroupMemberEntity } from "@/domains/groups/entities/group-member-entity"
import { AttachmentEntity } from "@/domains/messages/entities/attachment-entity"
import { CreateMessageEntity } from "@/domains/messages/entities/create-message-entity"
import {
  AttachmentType,
  MessageStatus,
} from "@/domains/messages/entities/enums"
import { MessageAuthorEntity } from "@/domains/messages/entities/message-author-entity"
import { MessageEntity } from "@/domains/messages/entities/message-entity"
import { UpdateMessageEntity } from "@/domains/messages/entities/update-message-entity"
import { MessageRepository } from "@/domains/messages/repositories/message-repository"
import { PrivateChatOptionEntity } from "@/domains/private-chat/entites/private-chat-option-entity"
import { prisma } from "@/infrastuctures/orm/prisma"

@injectable()
export class MessageRepositoryImpl implements MessageRepository {
  private getMessageInludeQuery = () => ({
    attachments: true,
    sender: {
      select: {
        id: true,
        profile: { select: { name: true, imageUrl: true } },
      },
    },
  })

  async getMessageById(messageId: string): Promise<MessageEntity | null> {
    const result = await prisma.message.findUnique({
      where: { id: messageId },
      include: { ...this.getMessageInludeQuery() },
    })

    if (!result) return null

    const attachements = result.attachments.map(
      (attachement) =>
        new AttachmentEntity(
          attachement.id,
          attachement.name,
          attachement.size,
          AttachmentType[attachement.type],
          attachement.url,
          attachement.downloadUrl,
        ),
    )

    return new MessageEntity(
      result.id,
      result.senderId,
      new MessageAuthorEntity(
        result.sender.id,
        result.sender.profile?.name,
        result.sender.profile?.imageUrl ?? undefined,
      ),
      result.isEmojiOnly,
      MessageStatus[result.status],
      attachements,
      result.createdAt,
      result.updatedAt,
      result.message ?? undefined,
      result.privateChatId ?? undefined,
      result.groupId ?? undefined,
      result.channelId ?? undefined,
    )
  }

  async createMessage(
    userId: string,
    data: CreateMessageEntity,
    parentMessage?: MessageEntity,
    privateChatId?: string,
  ): Promise<MessageEntity> {
    const result = await prisma.message.create({
      data: {
        message: data.message,
        senderId: userId,
        privateChatId,
        groupId: data.groupId,
        channelId: data.channelId,
        originalMessageId: data.originalMessageId,
        parentMessageId: parentMessage?.id ?? undefined,
        parentMessageName: parentMessage?.sender.name ?? undefined,
        parentMessageText: parentMessage?.message ?? undefined,
        status: "DEFAULT",
        isEmojiOnly: data.isEmojiOnly,
        attachments:
          data.attachments.length > 0
            ? {
                createMany: {
                  data: data.attachments.map((att) => ({
                    name: att.name,
                    size: att.size,
                    type: att.type,
                    url: att.url,
                    downloadUrl: att.downloadUrl,
                  })),
                },
              }
            : undefined,
      },
      include: { ...this.getMessageInludeQuery() },
    })

    return new MessageEntity(
      result.id,
      result.senderId,
      new MessageAuthorEntity(
        result.senderId,
        result.sender.profile?.name,
        result.sender.profile?.imageUrl ?? undefined,
      ),
      result.isEmojiOnly,
      MessageStatus[result.status],
      result.attachments.map(
        (att) =>
          new AttachmentEntity(
            att.id,
            att.name,
            att.size,
            AttachmentType[att.type],
            att.url,
            att.downloadUrl,
          ),
      ),
      result.createdAt,
      result.updatedAt,
      result.message ?? undefined,
      result.privateChatId ?? undefined,
      result.groupId ?? undefined,
      result.channelId ?? undefined,
      result.parentMessageId ?? undefined,
      result.parentMessageName ?? undefined,
      result.parentMessageText ?? undefined,
      result.originalMessageId ?? undefined,
    )
  }

  async getPrivateMessages(
    userId: string,
    receiverId: string,
    chatOptionHistory: PrivateChatOptionEntity[],
    blockedHistory: BlockedUserEntity[],
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<MessageEntity>> {
    const { limit, cursor } = params

    const datesOption = chatOptionHistory.map((opt) => {
      return {
        createdAt: {
          gte: opt.createdAt,
          lt: opt.deletedAt ?? new Date(),
        },
      }
    })
    const datesBlocked = blockedHistory.map((opt) => {
      return {
        OR: [
          { createdAt: { lt: opt.createdAt } },
          { createdAt: { gte: opt.unblockedAt ?? new Date() } },
        ],
      }
    })

    const result = await prisma.message.findMany({
      where: {
        privateChat: {
          OR: [
            { user1Id: userId, user2Id: receiverId },
            { user2Id: userId, user1Id: receiverId },
          ],
        },
        OR: datesOption.length > 0 ? datesOption : [],
        AND: datesBlocked.length > 0 ? datesBlocked : undefined,
        status: { not: "DELETED_FOR_ME" },
      },
      orderBy: { createdAt: "desc" },
      include: { ...this.getMessageInludeQuery() },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    let nextCursor: string | undefined = undefined
    if (result.length === limit + 1) {
      nextCursor = result.pop()?.id ?? undefined
    }

    const data = result.map((result) => {
      return new MessageEntity(
        result.id,
        result.senderId,
        new MessageAuthorEntity(
          result.senderId,
          result.sender.profile?.name,
          result.sender.profile?.imageUrl ?? undefined,
        ),
        result.isEmojiOnly,
        MessageStatus[result.status],
        result.attachments.map(
          (att) =>
            new AttachmentEntity(
              att.id,
              att.name,
              att.size,
              AttachmentType[att.type],
              att.url,
              att.downloadUrl,
            ),
        ),
        result.createdAt,
        result.updatedAt,
        result.message ?? undefined,
        result.privateChatId ?? undefined,
        result.groupId ?? undefined,
        result.channelId ?? undefined,
        result.parentMessageId ?? undefined,
        result.parentMessageName ?? undefined,
        result.parentMessageText ?? undefined,
        result.originalMessageId ?? undefined,
      )
    })

    return new SearchResultEntity<MessageEntity>(data, data.length, nextCursor)
  }

  async getGroupMessages(
    groupId: string,
    memberHistory: GroupMemberEntity[],
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<MessageEntity>> {
    const { limit, cursor } = params

    const datesMember = memberHistory.map((opt) => {
      return {
        createdAt: {
          gte: opt.createdAt,
          lt: opt.leftAt ?? new Date(),
        },
      }
    })

    const result = await prisma.message.findMany({
      where: {
        groupId,
        OR: datesMember.length > 0 ? datesMember : [],
        status: { not: "DELETED_FOR_ME" },
      },
      orderBy: { createdAt: "desc" },
      include: { ...this.getMessageInludeQuery() },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    let nextCursor: string | undefined = undefined
    if (result.length === limit + 1) {
      nextCursor = result.pop()?.id ?? undefined
    }

    const data = result.map((result) => {
      return new MessageEntity(
        result.id,
        result.senderId,
        new MessageAuthorEntity(
          result.senderId,
          result.sender.profile?.name,
          result.sender.profile?.imageUrl ?? undefined,
        ),
        result.isEmojiOnly,
        MessageStatus[result.status],
        result.attachments.map(
          (att) =>
            new AttachmentEntity(
              att.id,
              att.name,
              att.size,
              AttachmentType[att.type],
              att.url,
              att.downloadUrl,
            ),
        ),
        result.createdAt,
        result.updatedAt,
        result.message ?? undefined,
        result.privateChatId ?? undefined,
        result.groupId ?? undefined,
        result.channelId ?? undefined,
        result.parentMessageId ?? undefined,
        result.parentMessageName ?? undefined,
        result.parentMessageText ?? undefined,
        result.originalMessageId ?? undefined,
      )
    })

    return new SearchResultEntity<MessageEntity>(data, data.length, nextCursor)
  }

  async getChannelMessages(
    channelId: string,
    subsHistory: ChannelSubscriberEntity[],
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<MessageEntity>> {
    const { limit, cursor } = params

    const datesSubscribe = subsHistory.map((opt) => {
      return {
        createdAt: {
          gte: opt.createdAt,
          lt: opt.unsubscribedAt ?? new Date(),
        },
      }
    })

    const result = await prisma.message.findMany({
      where: {
        channelId,
        OR: datesSubscribe.length > 0 ? datesSubscribe : [],
        status: { not: "DELETED_FOR_ME" },
      },
      orderBy: { createdAt: "desc" },
      include: { ...this.getMessageInludeQuery() },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    let nextCursor: string | undefined = undefined
    if (result.length === limit + 1) {
      nextCursor = result.pop()?.id ?? undefined
    }

    const data = result.map((result) => {
      return new MessageEntity(
        result.id,
        result.senderId,
        new MessageAuthorEntity(
          result.senderId,
          result.sender.profile?.name,
          result.sender.profile?.imageUrl ?? undefined,
        ),
        result.isEmojiOnly,
        MessageStatus[result.status],
        result.attachments.map(
          (att) =>
            new AttachmentEntity(
              att.id,
              att.name,
              att.size,
              AttachmentType[att.type],
              att.url,
              att.downloadUrl,
            ),
        ),
        result.createdAt,
        result.updatedAt,
        result.message ?? undefined,
        result.privateChatId ?? undefined,
        result.groupId ?? undefined,
        result.channelId ?? undefined,
        result.parentMessageId ?? undefined,
        result.parentMessageName ?? undefined,
        result.parentMessageText ?? undefined,
        result.originalMessageId ?? undefined,
      )
    })

    return new SearchResultEntity<MessageEntity>(data, data.length, nextCursor)
  }

  async updateMessage(
    messageId: string,
    data: UpdateMessageEntity,
  ): Promise<MessageEntity> {
    const result = await prisma.message.update({
      where: { id: messageId },
      data: { message: data.message, isEmojiOnly: data.isEmojiOnly },
      include: { ...this.getMessageInludeQuery() },
    })

    return new MessageEntity(
      result.id,
      result.senderId,
      new MessageAuthorEntity(
        result.senderId,
        result.sender.profile?.name,
        result.sender.profile?.imageUrl ?? undefined,
      ),
      result.isEmojiOnly,
      MessageStatus[result.status],
      result.attachments.map(
        (att) =>
          new AttachmentEntity(
            att.id,
            att.name,
            att.size,
            AttachmentType[att.type],
            att.url,
            att.downloadUrl,
          ),
      ),
      result.createdAt,
      result.updatedAt,
      result.message ?? undefined,
      result.privateChatId ?? undefined,
      result.groupId ?? undefined,
      result.channelId ?? undefined,
      result.parentMessageId ?? undefined,
      result.parentMessageName ?? undefined,
      result.parentMessageText ?? undefined,
      result.originalMessageId ?? undefined,
    )
  }

  async deleteMessage(messageId: string): Promise<void> {
    await prisma.message.update({
      where: { id: messageId },
      data: { status: "DELETED_FOR_ME" },
    })
  }

  async deleteMessageForAll(messageId: string): Promise<void> {
    await prisma.message.update({
      where: { id: messageId },
      data: {
        status: "DELETED_FOR_ALL",
        attachments: { deleteMany: { messageId } },
      },
      include: { attachments: { select: { url: true } } },
    })
  }

  async deleteMessageByAdmin(messageId: string): Promise<void> {
    await prisma.message.update({
      where: { id: messageId },
      data: {
        status: "DELETED_BY_ADMIN",
        attachments: { deleteMany: { messageId } },
      },
      include: { attachments: { select: { url: true } } },
    })
  }
}

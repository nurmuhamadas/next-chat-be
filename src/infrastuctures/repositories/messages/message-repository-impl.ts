import { injectable } from "inversify"

import { AttachmentEntity } from "@/domains/messages/entities/attachment-entity"
import {
  AttachmentType,
  MessageStatus,
} from "@/domains/messages/entities/enums"
import { MessageAuthorEntity } from "@/domains/messages/entities/message-author-entity"
import { MessageEntity } from "@/domains/messages/entities/message-entity"
import { MessageRepository } from "@/domains/messages/repositories/message-repository"
import { prisma } from "@/infrastuctures/orm/prisma"

@injectable()
export class MessageRepositoryImpl implements MessageRepository {
  private getMessageInludeQuery = () => ({
    attachments: true,
    repliedMessage: {
      select: {
        id: true,
        message: true,
        sender: {
          select: {
            id: true,
            profile: { select: { name: true } },
          },
        },
      },
    },
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
}

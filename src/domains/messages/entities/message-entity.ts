import { AttachmentEntity } from "./attachment-entity"
import { MessageStatus } from "./enums"
import { MessageAuthorEntity } from "./message-author-entity"

export class MessageEntity {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly sender: MessageAuthorEntity,
    private readonly isEmojiOnly: boolean,
    private readonly status: MessageStatus,
    private readonly attachments: AttachmentEntity[],
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
    private readonly message?: string,
    private readonly privateChatId?: string,
    private readonly groupId?: string,
    private readonly channelId?: string,
    private readonly parentMessageId?: string,
    private readonly parentMessageName?: string,
    private readonly parentMessageText?: string,
    private readonly originalMessageId?: string,
  ) {}

  toDTO(): MessageDTO {
    return {
      id: this.id,
      message: this.message ?? null,
      sender: this.sender.toDTO(),
      isSender: this.userId === this.sender.id,
      isEmojiOnly: this.isEmojiOnly,
      status: this.status,
      privateChatId: this.privateChatId ?? null,
      groupId: this.groupId ?? null,
      channelId: this.channelId ?? null,
      parentMessageId: this.parentMessageId ?? null,
      parentMessageName: this.parentMessageName ?? null,
      parentMessageText: this.parentMessageText ?? null,
      originalMessageId: this.originalMessageId ?? null,
      attachments: this.attachments.map((v) => v.toDTO()),
      isUpdated: this.updatedAt > this.createdAt,
    }
  }
}

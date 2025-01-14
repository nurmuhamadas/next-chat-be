import { AttachmentEntity } from "./attachment-entity"
import { MessageStatus } from "./enums"
import { MessageAuthorEntity } from "./message-author-entity"

export class MessageEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly sender: MessageAuthorEntity,
    public readonly isEmojiOnly: boolean,
    public readonly status: MessageStatus,
    public readonly attachments: AttachmentEntity[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly message?: string,
    public readonly privateChatId?: string,
    public readonly groupId?: string,
    public readonly channelId?: string,
    public readonly parentMessageId?: string,
    public readonly parentMessageName?: string,
    public readonly parentMessageText?: string,
    public readonly originalMessageId?: string,
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
      createdAt: this.createdAt.toISOString(),
    }
  }
}

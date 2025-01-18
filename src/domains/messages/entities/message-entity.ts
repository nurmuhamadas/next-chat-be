import { AttachmentEntity } from "./attachment-entity"
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
    public readonly message?: string | null,
    public readonly privateChatId?: string | null,
    public readonly groupId?: string | null,
    public readonly channelId?: string | null,
    public readonly parentMessageId?: string | null,
    public readonly parentMessageName?: string | null,
    public readonly parentMessageText?: string | null,
    public readonly originalMessageId?: string | null,
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

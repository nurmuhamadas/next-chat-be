import { RoomType } from "@/domains/rooms/entities/enums"
import { UploadedFileEntity } from "@/domains/storage/entities/uploaded-file-entity"

export class CreateMessageEntity {
  constructor(
    public readonly receiverId: string,
    public readonly roomType: RoomType,
    public readonly isEmojiOnly: boolean,
    public readonly message?: string,
    public readonly parentMessageId?: string,
    public attachments: UploadedFileEntity[] = [],
  ) {}

  static fromJSON(json: {
    receiverId: string
    roomType: RoomType
    isEmojiOnly: boolean
    message?: string
    parentMessageId?: string
    originalMessageId?: string
  }) {
    return new CreateMessageEntity(
      json.receiverId,
      json.roomType,
      json.isEmojiOnly,
      json.message,
      json.parentMessageId,
    )
  }
}

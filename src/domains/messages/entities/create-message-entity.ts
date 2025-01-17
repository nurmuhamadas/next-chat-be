import { RoomType } from "@/domains/rooms/entities/enums"
import { UploadedFileEntity } from "@/domains/storage/entities/uploaded-file-entity"

export class CreateMessageEntity {
  constructor(
    private readonly receiverId: string,
    public readonly roomType: RoomType,
    public readonly isEmojiOnly: boolean,
    public readonly message?: string | null,
    public readonly parentMessageId?: string | null,
    public readonly originalMessageId?: string | null,
    public attachments: UploadedFileEntity[] = [],
  ) {}

  get userReceiverId() {
    return this.roomType === RoomType.PRIVATE ? this.receiverId : undefined
  }

  get groupId() {
    return this.roomType === RoomType.GROUP ? this.receiverId : undefined
  }

  get channelId() {
    return this.roomType === RoomType.CHANNEL ? this.receiverId : undefined
  }

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
      json.originalMessageId,
      json.parentMessageId,
    )
  }
}

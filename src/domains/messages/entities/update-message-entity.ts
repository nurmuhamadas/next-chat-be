export class UpdateMessageEntity {
  constructor(
    public readonly message?: string | null,
    public readonly isEmojiOnly?: boolean | null,
  ) {}

  static fromJSON(json: { message?: string; isEmojiOnly?: boolean }) {
    return new UpdateMessageEntity(json.message, json.isEmojiOnly)
  }
}

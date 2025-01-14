export class UpdateMessageEntity {
  constructor(
    public readonly message?: string,
    public readonly isEmojiOnly?: boolean,
  ) {}

  static fromJSON(json: { message?: string; isEmojiOnly?: boolean }) {
    return new UpdateMessageEntity(json.message, json.isEmojiOnly)
  }
}

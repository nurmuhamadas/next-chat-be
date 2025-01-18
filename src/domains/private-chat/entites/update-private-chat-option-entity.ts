export class UpdatePrivateChatOptionEntity {
  constructor(
    public readonly userId: string,
    public readonly notification: boolean,
  ) {}

  static fromJSON({
    userId,
    notification,
  }: {
    userId: string
    notification: boolean
  }) {
    return new UpdatePrivateChatOptionEntity(userId, notification)
  }
}

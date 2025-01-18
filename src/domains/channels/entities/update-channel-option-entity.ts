export class UpdateChannelOptionEntity {
  constructor(
    public readonly channelId: string,
    public readonly userId: string,
    public readonly notification: boolean,
  ) {}

  static fromJSON({
    channelId,
    userId,
    notification,
  }: {
    channelId: string
    userId: string
    notification: boolean
  }) {
    return new UpdateChannelOptionEntity(channelId, userId, notification)
  }
}

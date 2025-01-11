export class ChannelOptionEntity {
  constructor(
    public readonly id: string,
    public readonly channelId: string,
    public readonly userId: string,
    public readonly notification: boolean,
  ) {}

  public toDTO(): ChannelOptionDTO {
    return {
      id: this.id,
      channelId: this.channelId,
      userId: this.userId,
      notification: this.notification,
    }
  }
}

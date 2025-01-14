export class ChannelSubscriberEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isAdmin: boolean,
    public readonly createdAt: Date,
    public readonly unsubscribedAt?: Date,
    public readonly imageUrl?: string,
    public readonly lastSeenAt?: Date,
  ) {}

  public toDTO(): ChannelSubscriberDTO {
    return {
      id: this.id,
      name: this.name,
      isAdmin: this.isAdmin,
      imageUrl: this.imageUrl ?? null,
      lastSeenAt: this.lastSeenAt ? this.lastSeenAt.toISOString() : null,
    }
  }
}

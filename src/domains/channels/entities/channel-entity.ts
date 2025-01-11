import { ChannelType } from "./enums"

export class ChannelEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: ChannelType,
    public readonly ownerId: string,
    public readonly inviteCode: string,
    public readonly totalSubscribers: number,
    public readonly isSubscriber: boolean,
    public readonly isAdmin: boolean,
    public readonly description?: string,
    public readonly imageUrl?: string,
    public readonly deletedAt?: Date,
  ) {}

  get isDeleted() {
    return Boolean(this.deletedAt)
  }

  get deletedChannel() {
    return new ChannelEntity(
      this.id,
      "Deleted Channel",
      this.type,
      this.ownerId,
      this.inviteCode,
      0,
      this.isSubscriber,
      this.isAdmin,
      undefined,
      undefined,
      this.deletedAt,
    )
  }

  public toDTO(): ChannelDTO {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      ownerId: this.ownerId,
      inviteCode: this.inviteCode,
      totalSubscribers: this.totalSubscribers,
      isSubscriber: this.isSubscriber,
      isAdmin: this.isAdmin,
      description: this.description ?? null,
      imageUrl: this.imageUrl ?? null,
    }
  }
}

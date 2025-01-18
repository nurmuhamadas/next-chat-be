export class ChannelSearchEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly totalSubscribers: number,
    public readonly imageUrl?: string | null,
  ) {}

  public toDTO(): ChannelSearchDTO {
    return {
      id: this.id,
      name: this.name,
      totalSubscribers: this.totalSubscribers,
      imageUrl: this.imageUrl ?? null,
    }
  }
}

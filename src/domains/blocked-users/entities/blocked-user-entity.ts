export class BlockedUserEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly blockedUserId: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly imageUrl?: string,
    public readonly unblockedAt?: Date,
  ) {}

  public toDTO(): BlockedUserDTO {
    return {
      id: this.blockedUserId,
      name: this.name,
      imageUrl: this.imageUrl ?? null,
    }
  }
}

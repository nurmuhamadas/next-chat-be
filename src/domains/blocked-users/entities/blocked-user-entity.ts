export class BlockedUserEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly blockedUserId: string,
    public readonly createdAt: Date,
    public readonly name?: string | null,
    public readonly imageUrl?: string | null,
    public readonly unblockedAt?: Date | null,
  ) {}

  public toDTO(): BlockedUserDTO {
    return {
      id: this.blockedUserId,
      name: this.name ?? "Unknown",
      imageUrl: this.imageUrl ?? null,
    }
  }
}

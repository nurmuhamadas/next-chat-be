export class SearchUserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly imageUrl?: string | null,
    public readonly lastSeenAt?: Date | null,
  ) {}

  public toUserSearchDTO(): UserSearchDTO {
    return {
      id: this.id,
      name: this.name,
      imageUrl: this.imageUrl ?? null,
      lastSeenAt: this.lastSeenAt ? this.lastSeenAt.toISOString() : null,
    }
  }
}

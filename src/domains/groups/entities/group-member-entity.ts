export class GroupMemberEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isAdmin: boolean,
    public readonly imageUrl?: string,
    public readonly lastSeenAt?: Date,
  ) {}

  public toDTO(): GroupMemberDTO {
    return {
      id: this.id,
      name: this.name,
      isAdmin: this.isAdmin,
      imageUrl: this.imageUrl ?? null,
      lastSeenAt: this.lastSeenAt ? this.lastSeenAt.toISOString() : null,
    }
  }
}

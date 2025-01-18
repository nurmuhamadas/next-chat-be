export class SearchUserForMemberEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly allowAddToGroup: boolean,
    public readonly imageUrl?: string | null,
    public readonly lastSeenAt?: Date | null,
  ) {}

  public toUserSearchForMemberDTO(): UserSearchForMemberDTO {
    return {
      id: this.id,
      name: this.name,
      allowAddToGroup: this.allowAddToGroup,
      imageUrl: this.imageUrl ?? null,
      lastSeenAt: this.lastSeenAt ? this.lastSeenAt.toISOString() : null,
    }
  }
}

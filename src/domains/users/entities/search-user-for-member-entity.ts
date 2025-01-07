export class SearchUserForMemberEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly allowAddToGroup: boolean,
    public readonly imageUrl?: string,
    public readonly lastSeenAt?: Date,
  ) {}
}

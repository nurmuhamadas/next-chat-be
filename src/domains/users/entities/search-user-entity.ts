export class SearchUserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly imageUrl?: string,
    public readonly lastSeenAt?: Date,
  ) {}
}

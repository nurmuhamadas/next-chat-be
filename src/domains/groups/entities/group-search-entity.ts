export class GroupSearchEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly totalMembers: number,
    public readonly imageUrl?: string,
  ) {}

  public toDTO(): GroupSearchDTO {
    return {
      id: this.id,
      name: this.name,
      totalMembers: this.totalMembers,
      imageUrl: this.imageUrl ?? null,
    }
  }
}

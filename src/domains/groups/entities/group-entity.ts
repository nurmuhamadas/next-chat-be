import { GroupType } from "./enums"

export class GroupEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: GroupType,
    public readonly ownerId: string,
    public readonly inviteCode: string,
    public readonly totalMembers: number,
    public readonly isMember: boolean,
    public readonly isAdmin: boolean,
    public readonly description?: string,
    public readonly imageUrl?: string,
    public readonly deletedAt?: Date,
  ) {}

  get isDeleted() {
    return Boolean(this.deletedAt)
  }

  get deletedGroup() {
    return new GroupEntity(
      this.id,
      "Deleted Group",
      this.type,
      this.ownerId,
      this.inviteCode,
      0,
      this.isMember,
      this.isAdmin,
      undefined,
      undefined,
      this.deletedAt,
    )
  }

  public toDTO(): GroupDTO {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      ownerId: this.ownerId,
      inviteCode: this.inviteCode,
      totalMembers: this.totalMembers,
      isMember: this.isMember,
      isAdmin: this.isAdmin,
      description: this.description ?? null,
      imageUrl: this.imageUrl ?? null,
    }
  }
}

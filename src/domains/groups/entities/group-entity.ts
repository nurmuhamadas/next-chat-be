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
  ) {}

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

import { GroupType as IGroupType } from "./enums"

export class CreateGroupEntity {
  constructor(
    public readonly name: string,
    public readonly type: IGroupType,
    public readonly ownerId: string,
    public readonly memberIds: string[],
    public readonly description?: string,
    public imageUrl?: string,
  ) {}

  static fromJSON(json: {
    name: string
    description?: string
    type: GroupType
    ownerId: string
    memberIds: string[]
    imageUrl?: string
  }) {
    return new CreateGroupEntity(
      json.name,
      json.type === "PUBLIC" ? IGroupType.PUBLIC : IGroupType.PRIVATE,
      json.ownerId,
      json.memberIds,
      json.description,
      json.imageUrl,
    )
  }
}

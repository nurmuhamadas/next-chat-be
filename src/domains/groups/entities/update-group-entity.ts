import { GroupType as IGroupType } from "./enums"

export class UpdateGroupEntity {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly type?: IGroupType,
    public readonly description?: string,
    public imageUrl?: string,
  ) {}

  static fromJSON(json: {
    id: string
    name?: string
    description?: string
    type?: GroupType
    imageUrl?: string
  }) {
    return new UpdateGroupEntity(
      json.id,
      json.name,
      json.type === "PUBLIC" ? IGroupType.PUBLIC : IGroupType.PRIVATE,
      json.description,
      json.imageUrl,
    )
  }
}

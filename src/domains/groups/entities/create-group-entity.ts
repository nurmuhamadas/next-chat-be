export class CreateGroupEntity {
  constructor(
    public readonly name: string,
    public readonly type: GroupType,
    public readonly ownerId: string,
    public readonly memberIds: string[],
    public readonly description?: string | null,
    public imageUrl?: string | null,
  ) {}

  static fromJSON(json: {
    name: string
    description?: string | null
    type: GroupType
    ownerId: string
    memberIds: string[]
    imageUrl?: string | null
  }) {
    return new CreateGroupEntity(
      json.name,
      json.type,
      json.ownerId,
      json.memberIds,
      json.description,
      json.imageUrl,
    )
  }
}

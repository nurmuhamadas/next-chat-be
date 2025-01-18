export class UpdateGroupEntity {
  constructor(
    public readonly id: string,
    public readonly name?: string | null,
    public readonly type?: GroupType | null,
    public readonly description?: string | null,
    public imageUrl?: string | null,
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
      json.type,
      json.description,
      json.imageUrl,
    )
  }
}

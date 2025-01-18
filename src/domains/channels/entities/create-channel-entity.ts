export class CreateChannelEntity {
  constructor(
    public readonly name: string,
    public readonly type: ChannelType,
    public readonly ownerId: string,
    public readonly description?: string | null,
    public imageUrl?: string | null,
  ) {}

  static fromJSON(json: {
    name: string
    type: ChannelType
    ownerId: string
    description?: string | null
    imageUrl?: string | null
  }) {
    return new CreateChannelEntity(
      json.name,
      json.type,
      json.ownerId,
      json.description,
      json.imageUrl,
    )
  }
}

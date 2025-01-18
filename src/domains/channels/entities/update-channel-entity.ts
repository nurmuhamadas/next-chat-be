export class UpdateChannelEntity {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly type?: ChannelType,
    public readonly description?: string,
    public imageUrl?: string,
  ) {}

  static fromJSON(json: {
    id: string
    name?: string
    description?: string
    type?: ChannelType
    imageUrl?: string
  }) {
    return new UpdateChannelEntity(
      json.id,
      json.name,
      json.type,
      json.description,
      json.imageUrl,
    )
  }
}

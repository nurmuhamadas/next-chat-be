import { ChannelType } from "./enums"

export class CreateChannelEntity {
  constructor(
    public readonly name: string,
    public readonly type: ChannelType,
    public readonly ownerId: string,
    public readonly description?: string,
    public imageUrl?: string,
  ) {}

  static fromJSON(json: {
    name: string
    type: ChannelType
    ownerId: string
    description?: string
    imageUrl?: string
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

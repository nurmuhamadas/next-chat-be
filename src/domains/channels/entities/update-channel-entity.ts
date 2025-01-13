import { ChannelType as IChannelType } from "./enums"

export class UpdateChannelEntity {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly type?: IChannelType,
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
      json.type === "PUBLIC" ? IChannelType.PUBLIC : IChannelType.PRIVATE,
      json.description,
      json.imageUrl,
    )
  }
}

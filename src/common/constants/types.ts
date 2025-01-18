export const CHANNEL_TYPES: Record<ChannelType, ChannelType> = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
}

export const ROOM_TYPE_TO_DTO: Record<RoomType, RoomTypeDTO> = {
  PRIVATE: "chat",
  GROUP: "group",
  CHANNEL: "channel",
}

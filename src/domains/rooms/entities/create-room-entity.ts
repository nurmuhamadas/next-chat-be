export class CreateRoomEntity {
  constructor(
    public readonly type: RoomType,
    public readonly ownerId: string,
    public readonly totalUnreadMessage: number,
    public readonly lastMessageId?: string,
    public readonly privateChatId?: string,
    public readonly groupId?: string,
    public readonly channelId?: string,
  ) {}
}

export class CreateRoomEntity {
  constructor(
    public readonly type: RoomType,
    public readonly ownerId: string,
    public readonly totalUnreadMessage: number,
    public readonly lastMessageId?: string | null,
    public readonly privateChatId?: string | null,
    public readonly groupId?: string | null,
    public readonly channelId?: string | null,
  ) {}
}

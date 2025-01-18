export abstract class UnreadMessageRepository {
  abstract readMessage(userId: string, receiverId: string): Promise<void>

  abstract incrementUnreadMessageCount(
    userId: string,
    receiverId: string,
  ): Promise<void>

  abstract deleteRecords(userId: string, receiverId: string): Promise<void>

  abstract incrementGroupUnreadMessageCountExceptOwner(
    userId: string,
    groupId: string,
  ): Promise<void>

  abstract incrementChannelUnreadMessageCountExceptOwner(
    userId: string,
    channelId: string,
  ): Promise<void>
}

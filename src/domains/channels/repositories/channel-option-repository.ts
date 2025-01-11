export abstract class ChannelOptionRepository {
  abstract clearAllChats(
    channelId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<void>
}

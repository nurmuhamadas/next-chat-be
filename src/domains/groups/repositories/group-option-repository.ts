export abstract class GroupOptionRepository {
  abstract clearAllChats(
    groupId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<void>
}

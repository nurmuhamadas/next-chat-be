export class UpdateGroupOptionEntity {
  constructor(
    public readonly groupId: string,
    public readonly userId: string,
    public readonly notification: boolean,
  ) {}

  public fromJSON({
    groupId,
    userId,
    notification,
  }: {
    groupId: string
    userId: string
    notification: boolean
  }) {
    return new UpdateGroupOptionEntity(groupId, userId, notification)
  }
}

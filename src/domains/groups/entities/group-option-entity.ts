export class GroupOptionEntity {
  constructor(
    public readonly id: string,
    public readonly groupId: string,
    public readonly userId: string,
    public readonly notification: boolean,
  ) {}

  public toDTO(): GroupOptionDTO {
    return {
      id: this.id,
      groupId: this.groupId,
      userId: this.userId,
      notification: this.notification,
    }
  }
}

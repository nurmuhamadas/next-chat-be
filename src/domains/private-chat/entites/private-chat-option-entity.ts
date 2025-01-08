export class PrivateChatOptionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly privateChatId: string,
    public readonly notification: boolean,
  ) {}

  public toDTO(): PrivateChatOptionDTO {
    return {
      userId: this.userId,
      privateChatId: this.privateChatId,
      notification: this.notification,
    }
  }
}

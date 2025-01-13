export class CreatePrivateChatEntity {
  constructor(
    public readonly userId1: string,
    public readonly userId2: string,
  ) {}

  fromJSON(json: { userId1: string; userId2: string }) {
    return new CreatePrivateChatEntity(json.userId1, json.userId2)
  }
}

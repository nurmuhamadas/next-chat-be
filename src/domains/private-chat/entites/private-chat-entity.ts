export class PrivateChatEntity {
  constructor(
    public readonly id: string,
    public readonly userId1: string,
    public readonly userId2: string,
  ) {}
}

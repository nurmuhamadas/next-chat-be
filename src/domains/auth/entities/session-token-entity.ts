export class SessionTokenEntity {
  constructor(
    public readonly userId: string,
    public username: string,
    public deviceId: string,
    public email: string,
  ) {}
}

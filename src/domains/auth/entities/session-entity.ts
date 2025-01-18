export class SessionEntity {
  constructor(
    public readonly userId: string,
    public readonly token: string,
    public readonly deviceId: string,
    public readonly userAgent: string,
    public readonly email: string,
    public readonly expiresAt: Date,
  ) {}

  get isExpired() {
    return this.expiresAt.getTime() < Date.now()
  }
}

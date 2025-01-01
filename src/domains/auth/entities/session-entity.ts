export class SessionEntity {
  constructor(
    public readonly userId: string,
    public token: string,
    public deviceId: string,
    public userAgent: string,
    public email: string,
    public expiresAt: Date,
  ) {}

  get isExpired() {
    return this.expiresAt.getTime() < Date.now()
  }
}

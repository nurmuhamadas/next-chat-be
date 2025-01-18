export class VerificationTokenEntity {
  constructor(
    public readonly email: string,
    public readonly token: string,
    public readonly expiresAt: Date,
  ) {}

  get isExpired() {
    return this.expiresAt.getTime() < Date.now()
  }
}

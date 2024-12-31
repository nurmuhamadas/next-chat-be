export class VerificationTokenEntity {
  constructor(
    public email: string,
    public token: string,
    public expiresAt: Date,
  ) {}

  get isExpired() {
    return this.expiresAt.getTime() < Date.now()
  }
}

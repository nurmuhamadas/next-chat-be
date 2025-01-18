export class SessionTokenEntity {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly deviceId: string,
    public readonly email: string,
    public readonly userAgent: string,
    public readonly isProfileComplete: boolean,
  ) {}
}

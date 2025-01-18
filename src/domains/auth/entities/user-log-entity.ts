export class UserLogEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly sessionId: string,
    public readonly activity: LogActivity,
    public readonly description?: string | null,
  ) {}
}

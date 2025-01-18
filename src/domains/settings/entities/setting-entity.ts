export class SettingEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly timeFormat: TimeFormat,
    public readonly language: Language,
    public readonly notifications: Notifications[],
    public readonly enable2FA: boolean,
    public readonly showLastSeen: boolean,
    public readonly allowAddToGroup: boolean,
  ) {}

  public toDTO(): SettingDTO {
    return {
      id: this.id,
      userId: this.userId,
      timeFormat: this.timeFormat,
      language: this.language,
      notifications: this.notifications,
      enable2FA: this.enable2FA,
      showLastSeen: this.showLastSeen,
      allowAddToGroup: this.allowAddToGroup,
    }
  }
}

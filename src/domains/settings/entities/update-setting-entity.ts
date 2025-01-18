export class UpdateSettingEntity {
  constructor(
    public readonly userId: string,
    public readonly timeFormat?: TimeFormat,
    public readonly language?: Language,
    public readonly notifications?: Notifications[],
    public readonly enable2FA?: boolean,
    public readonly showLastSeen?: boolean,
    public readonly allowAddToGroup?: boolean,
  ) {}

  static fromJSON(
    userId: string,
    dto: Partial<Omit<SettingDTO, "id" | "userId">>,
  ) {
    return new UpdateSettingEntity(
      userId,
      dto.timeFormat,
      dto.language,
      dto.notifications,
      dto.enable2FA,
      dto.showLastSeen,
      dto.allowAddToGroup,
    )
  }
}

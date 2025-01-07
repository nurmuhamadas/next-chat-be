import { Language, Notifications, TimeFormat } from "./enums"

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

  static fromDTO(
    userId: string,
    dto: Partial<Omit<SettingDTO, "id" | "userId">>,
  ) {
    return new UpdateSettingEntity(
      userId,
      dto.timeFormat === "12-HOUR" ? TimeFormat.HALF_DAY : TimeFormat.FULL_DAY,
      dto.language === "en_US" ? Language.ENGLISH : Language.INDONESIAN,
      dto.notifications?.map((v) =>
        v === "PRIVATE"
          ? Notifications.PRIVATE
          : v === "GROUP"
            ? Notifications.GROUP
            : Notifications.CHANNEL,
      ),
      dto.enable2FA,
      dto.showLastSeen,
      dto.allowAddToGroup,
    )
  }
}

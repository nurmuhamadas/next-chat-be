export type TimeFormat = "12-HOUR" | "24-HOUR"

export type Language = "en_US" | "id_ID"

export type Notification = "PRIVATE" | "GROUP" | "CHANNEL"

export class SettingEntity {
  constructor(
    public readonly userId: string,
    public timeFormat: TimeFormat,
    public language: Language,
    public notifications: Notification[],
    public enable2FA: boolean,
    public showLastSeen: boolean,
    public allowAddToGroup: boolean,
  ) {}
}

import { Language, Notifications, TimeFormat } from "./enums"

export class CreateSettingEntity {
  constructor(
    public readonly userId: string,
    public readonly timeFormat: TimeFormat,
    public readonly language: Language,
    public readonly notifications: Notifications[],
    public readonly enable2FA: boolean,
    public readonly showLastSeen: boolean,
    public readonly allowAddToGroup: boolean,
  ) {}
}

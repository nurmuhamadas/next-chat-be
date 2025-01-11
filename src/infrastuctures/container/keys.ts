export const KEYS = {
  // COMMONS
  PasswordHash: Symbol.for("PasswordHash"),
  AuthTokenManager: Symbol.for("AuthTokenManager"),
  AppwriteClient: Symbol.for("AppwriteClient"),

  // STORAGE
  StorageRepository: Symbol.for("StorageRepository"),

  // AUTH
  AuthRepository: Symbol.for("AuthRepository"),
  SessionRepository: Symbol.for("SessionRepository"),
  TokenRepository: Symbol.for("TokenRepository"),

  // PROFILE
  ProfileRepository: Symbol.for("ProfileRepository"),

  // SETTING
  SettingRepository: Symbol.for("SettingRepository"),

  // BLOCKED USER
  BlockedUserRepository: Symbol.for("BlockedUserRepository"),

  // PRIVATE CHAT
  PrivateChatOptionRepository: Symbol.for("PrivateChatOptionRepository"),

  // GROUPS
  GroupRepository: Symbol.for("GroupRepository"),
  GroupMemberRepository: Symbol.for("GroupMemberRepository"),
  GroupOptionRepository: Symbol.for("GroupOptionRepository"),

  // CHANNELS
  ChannelRepository: Symbol.for("ChannelRepository"),
}

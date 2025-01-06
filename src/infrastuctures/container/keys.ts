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
}

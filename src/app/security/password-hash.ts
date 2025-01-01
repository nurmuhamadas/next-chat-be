export abstract class PasswordHash {
  abstract hash(password: string): Promise<string>

  abstract comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean>
}

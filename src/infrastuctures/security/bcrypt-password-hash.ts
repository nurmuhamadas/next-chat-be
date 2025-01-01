import { PasswordHash } from "@/app/security/password-hash"

export class BcryptPasswordHash implements PasswordHash {
  static SALT_ROUND = 10

  hash(password: string): Promise<string> {
    return Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: BcryptPasswordHash.SALT_ROUND,
    })
  }

  comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return Bun.password.verify(password, hashedPassword)
  }
}

import bcrypt from "bcryptjs"
import { injectable } from "inversify"

import { PasswordHash } from "@/app/security/password-hash"

@injectable()
export class BcryptPasswordHash implements PasswordHash {
  static SALT_ROUND = 10

  hash(password: string): Promise<string> {
    return bcrypt.hash(password, BcryptPasswordHash.SALT_ROUND)
  }

  comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}

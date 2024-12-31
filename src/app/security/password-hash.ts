export interface PasswordHash {
  hash(password: string): Promise<string>

  comparePassword(password: string, hashedPassword: string): Promise<boolean>
}

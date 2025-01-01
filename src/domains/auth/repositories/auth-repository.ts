import { UserEntity } from "../entities/user-entity"

export interface AuthRepository {
  validateUsernameAvailability(username: string): Promise<boolean>

  getUserByEmail(email: string): Promise<UserEntity | null>

  createUser(
    username: string,
    email: string,
    password: string,
    token: string,
    expiresAt: Date,
  ): Promise<UserEntity>
}

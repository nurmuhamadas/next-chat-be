import { UserEntity } from "../entities/user-entity"

export abstract class AuthRepository {
  abstract validateUsernameAvailability(username: string): Promise<boolean>

  abstract getUserByEmail(email: string): Promise<UserEntity | null>

  abstract createUser(
    username: string,
    email: string,
    password: string,
    token: string,
    expiresAt: Date,
  ): Promise<UserEntity>
}

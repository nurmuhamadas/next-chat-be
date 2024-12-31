import { UserEntity } from "../entities/user-entity"

export interface AuthRepository {
  validateUsernameAvailability(username: string): Promise<boolean>

  getUserByEmail(email: string): Promise<UserEntity>

  createUser(
    username: string,
    email: string,
    password: string,
    token: string,
  ): Promise<UserEntity>
}

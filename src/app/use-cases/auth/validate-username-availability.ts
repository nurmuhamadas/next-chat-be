import { inject, injectable } from "inversify"

import { AuthRepository } from "@/domains/auth/repositories/auth-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class ValidateUsernameAvailability {
  constructor(
    @inject(KEYS.AuthRepository) private authRepository: AuthRepository,
  ) {}

  async execute(username: string): Promise<boolean> {
    return this.authRepository.validateUsernameAvailability(username)
  }
}

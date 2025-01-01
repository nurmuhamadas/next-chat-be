import { AuthRepository } from "@/domains/auth/repositories/auth-repository"

export class ValidateUsernameAvailability {
  constructor(private authRepository: AuthRepository) {}

  async execute(username: string): Promise<boolean> {
    return this.authRepository.validateUsernameAvailability(username)
  }
}

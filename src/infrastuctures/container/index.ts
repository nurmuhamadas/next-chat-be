import { Container } from "inversify"

import { AuthTokenManager } from "@/app/security/auth-token-manager"
import { PasswordHash } from "@/app/security/password-hash"
import { SignUp } from "@/app/use-cases/sign-up"
import { ValidateUsernameAvailability } from "@/app/use-cases/validate-username-availability"
import { AuthRepository } from "@/domains/auth/repositories/auth-repository"

import { AuthRepositoryImpl } from "../repositories/auth-repository-impl"
import { BcryptPasswordHash } from "../security/bcrypt-password-hash"
import { JWTTokenManager } from "../security/jwt-token-manager"

import { KEYS } from "./keys"

const container = new Container()

// COMMON
container
  .bind<PasswordHash>(KEYS.PasswordHash)
  .to(BcryptPasswordHash)
  .inSingletonScope()
container
  .bind<AuthTokenManager>(KEYS.AuthTokenManager)
  .to(JWTTokenManager)
  .inSingletonScope()

// AUTH
container.bind<AuthRepository>(KEYS.AuthRepository).to(AuthRepositoryImpl)

container.bind<SignUp>(SignUp).toSelf()
container
  .bind<ValidateUsernameAvailability>(ValidateUsernameAvailability)
  .toSelf()

export { container }

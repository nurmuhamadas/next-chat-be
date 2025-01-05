import { Container } from "inversify"

import { AuthTokenManager } from "@/app/security/auth-token-manager"
import { PasswordHash } from "@/app/security/password-hash"
import { WebSocketManager } from "@/app/socket/web-socket-manager"
import { SignIn } from "@/app/use-cases/sign-in"
import { SignUp } from "@/app/use-cases/sign-up"
import { ValidateUsernameAvailability } from "@/app/use-cases/validate-username-availability"
import { AuthRepository } from "@/domains/auth/repositories/auth-repository"
import { SessionRepository } from "@/domains/auth/repositories/session-repository"
import { TokenRepository } from "@/domains/auth/repositories/token-repository"

import { AuthRepositoryImpl } from "../repositories/auth-repository-impl"
import { SessionRepositoryImpl } from "../repositories/session-repository-impl"
import { TokenRepositoryImpl } from "../repositories/token-repository-impl"
import { BcryptPasswordHash } from "../security/bcrypt-password-hash"
import { JWTTokenManager } from "../security/jwt-token-manager"
import { HonoWebSocket } from "../socket/hono-web-socket"

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
container.bind<WebSocketManager>(KEYS.WebSocketManager).to(HonoWebSocket)

// AUTH
container.bind<AuthRepository>(KEYS.AuthRepository).to(AuthRepositoryImpl)
container
  .bind<SessionRepository>(KEYS.SessionRepository)
  .to(SessionRepositoryImpl)
container.bind<TokenRepository>(KEYS.TokenRepository).to(TokenRepositoryImpl)

container
  .bind<ValidateUsernameAvailability>(ValidateUsernameAvailability)
  .toSelf()
container.bind<SignUp>(SignUp).toSelf()
container.bind<SignIn>(SignIn).toSelf()

export { container }

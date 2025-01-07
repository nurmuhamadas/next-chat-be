import { Container } from "inversify"

import { AuthTokenManager } from "@/app/security/auth-token-manager"
import { PasswordHash } from "@/app/security/password-hash"
import { SignIn } from "@/app/use-cases/auth/sign-in"
import { SignOut } from "@/app/use-cases/auth/sign-out"
import { SignUp } from "@/app/use-cases/auth/sign-up"
import { ValidateUsernameAvailability } from "@/app/use-cases/auth/validate-username-availability"
import { CreateProfile } from "@/app/use-cases/user/create-profile"
import { GetMyProfile } from "@/app/use-cases/user/get-my-profile"
import { SearchUsers } from "@/app/use-cases/user/search-users"
import { SearchUsersForMember } from "@/app/use-cases/user/search-users-for-member"
import { UpdateProfile } from "@/app/use-cases/user/update-profile"
import { AuthRepository } from "@/domains/auth/repositories/auth-repository"
import { SessionRepository } from "@/domains/auth/repositories/session-repository"
import { TokenRepository } from "@/domains/auth/repositories/token-repository"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"

import { AuthRepositoryImpl } from "../repositories/auth/auth-repository-impl"
import { SessionRepositoryImpl } from "../repositories/auth/session-repository-impl"
import { TokenRepositoryImpl } from "../repositories/auth/token-repository-impl"
import { StorageRepositoryImpl } from "../repositories/storage/storage-repository-impl"
import { ProfileRepositoryImpl } from "../repositories/user/profile-repository-impl"
import { BcryptPasswordHash } from "../security/bcrypt-password-hash"
import { JWTTokenManager } from "../security/jwt-token-manager"
import { AppwriteClient } from "../storage/appwrite"

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
container
  .bind<AppwriteClient>(KEYS.AppwriteClient)
  .to(AppwriteClient)
  .inSingletonScope()

// STORAGE
container
  .bind<StorageRepository>(KEYS.StorageRepository)
  .to(StorageRepositoryImpl)

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
container.bind<SignOut>(SignOut).toSelf()

// USER PROFILE
container
  .bind<ProfileRepository>(KEYS.ProfileRepository)
  .to(ProfileRepositoryImpl)

container.bind<CreateProfile>(CreateProfile).toSelf()
container.bind<UpdateProfile>(UpdateProfile).toSelf()
container.bind<SearchUsers>(SearchUsers).toSelf()
container.bind<SearchUsersForMember>(SearchUsersForMember).toSelf()
container.bind<GetMyProfile>(GetMyProfile).toSelf()

export { container }

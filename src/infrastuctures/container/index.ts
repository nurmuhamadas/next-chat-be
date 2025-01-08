import { Container } from "inversify"

import { AuthTokenManager } from "@/app/security/auth-token-manager"
import { PasswordHash } from "@/app/security/password-hash"
import { SignIn } from "@/app/use-cases/auth/sign-in"
import { SignOut } from "@/app/use-cases/auth/sign-out"
import { SignUp } from "@/app/use-cases/auth/sign-up"
import { ValidateUsernameAvailability } from "@/app/use-cases/auth/validate-username-availability"
import { BlockUser } from "@/app/use-cases/blocked-user/block-user"
import { GetBlockedUsers } from "@/app/use-cases/blocked-user/get-blocked-users"
import { GetIsUserBlocked } from "@/app/use-cases/blocked-user/get-is-user-blocked"
import { UnblockUser } from "@/app/use-cases/blocked-user/unblock-user"
import { AddGroupAdmin } from "@/app/use-cases/groups/add-group-admin"
import { AddGroupMember } from "@/app/use-cases/groups/add-group-member"
import { CreateGroup } from "@/app/use-cases/groups/create-group"
import { DeleteGroupMember } from "@/app/use-cases/groups/delete-group-member"
import { GetGroupById } from "@/app/use-cases/groups/get-group-by-id"
import { GetGroupMembers } from "@/app/use-cases/groups/get-group-members"
import { GetJoinedGroups } from "@/app/use-cases/groups/get-joined-groups"
import { GetNameAvailability } from "@/app/use-cases/groups/get-name-availability"
import { RemoveGroupAdmin } from "@/app/use-cases/groups/remove-group-admin"
import { SearchPublicGroups } from "@/app/use-cases/groups/search-public-groups"
import { UpdateGroup } from "@/app/use-cases/groups/update-group"
import { ClearChat } from "@/app/use-cases/private-chat/clear-chat"
import { GetPrivateChatOption } from "@/app/use-cases/private-chat/get-private-chat-option"
import { UpdatePrivateChatOption } from "@/app/use-cases/private-chat/update-private-chat-option"
import { GetSetting } from "@/app/use-cases/settings/get-setting"
import { UpdateSetting } from "@/app/use-cases/settings/update-setting"
import { CreateProfile } from "@/app/use-cases/user/create-profile"
import { GetMyProfile } from "@/app/use-cases/user/get-my-profile"
import { GetUserProfile } from "@/app/use-cases/user/get-user-profile"
import { SearchUsers } from "@/app/use-cases/user/search-users"
import { SearchUsersForMember } from "@/app/use-cases/user/search-users-for-member"
import { UpdateProfile } from "@/app/use-cases/user/update-profile"
import { AuthRepository } from "@/domains/auth/repositories/auth-repository"
import { SessionRepository } from "@/domains/auth/repositories/session-repository"
import { TokenRepository } from "@/domains/auth/repositories/token-repository"
import { BlockedUserRepository } from "@/domains/blocked-users/repositories/blocked-user-repository"
import { GroupMemberRepository } from "@/domains/groups/repositories/group-member-repository"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { PrivateChatOptionRepository } from "@/domains/private-chat/repositories/private-chat-option-repository"
import { SettingRepository } from "@/domains/settings/repositories/setting-repository"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"

import { AuthRepositoryImpl } from "../repositories/auth/auth-repository-impl"
import { SessionRepositoryImpl } from "../repositories/auth/session-repository-impl"
import { TokenRepositoryImpl } from "../repositories/auth/token-repository-impl"
import { BlockedUserRepositoryImpl } from "../repositories/blocked-user/blocked-user-repository-impl"
import { GroupMemberRepositoryImpl } from "../repositories/groups/group-member-repository-impl"
import { GroupRepositoryImpl } from "../repositories/groups/group-repository-impl"
import { PrivateChatOptionRepositoryImpl } from "../repositories/private-chat/private-chat-option-repository-impl"
import { SettingRepositoryImpl } from "../repositories/setting/setting-repository-impl"
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
container.bind<GetUserProfile>(GetUserProfile).toSelf()

// SETTING
container
  .bind<SettingRepository>(KEYS.SettingRepository)
  .to(SettingRepositoryImpl)

container.bind<UpdateSetting>(UpdateSetting).toSelf()
container.bind<GetSetting>(GetSetting).toSelf()

// BLOCKED USER
container
  .bind<BlockedUserRepository>(KEYS.BlockedUserRepository)
  .to(BlockedUserRepositoryImpl)

container.bind<GetBlockedUsers>(GetBlockedUsers).toSelf()
container.bind<GetIsUserBlocked>(GetIsUserBlocked).toSelf()
container.bind<BlockUser>(BlockUser).toSelf()
container.bind<UnblockUser>(UnblockUser).toSelf()

// PRIVATE CHAT
container
  .bind<PrivateChatOptionRepository>(KEYS.PrivateChatOptionRepository)
  .to(PrivateChatOptionRepositoryImpl)
  .inSingletonScope()

container.bind<GetPrivateChatOption>(GetPrivateChatOption).toSelf()
container.bind<UpdatePrivateChatOption>(UpdatePrivateChatOption).toSelf()
container.bind<ClearChat>(ClearChat).toSelf()

// GROUP
container
  .bind<GroupRepository>(KEYS.GroupRepository)
  .to(GroupRepositoryImpl)
  .inSingletonScope()
container
  .bind<GroupMemberRepository>(KEYS.GroupMemberRepository)
  .to(GroupMemberRepositoryImpl)
  .inSingletonScope()

container.bind<GetJoinedGroups>(GetJoinedGroups).toSelf()
container.bind<CreateGroup>(CreateGroup).toSelf()
container.bind<GetNameAvailability>(GetNameAvailability).toSelf()
container.bind<SearchPublicGroups>(SearchPublicGroups).toSelf()
container.bind<GetGroupById>(GetGroupById).toSelf()
container.bind<UpdateGroup>(UpdateGroup).toSelf()

container.bind<GetGroupMembers>(GetGroupMembers).toSelf()
container.bind<AddGroupMember>(AddGroupMember).toSelf()
container.bind<DeleteGroupMember>(DeleteGroupMember).toSelf()

container.bind<AddGroupAdmin>(AddGroupAdmin).toSelf()
container.bind<RemoveGroupAdmin>(RemoveGroupAdmin).toSelf()

export { container }

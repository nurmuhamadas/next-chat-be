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
import { AddChannelAdmin } from "@/app/use-cases/channels/add-channel-admin"
import { ClearChannelChat } from "@/app/use-cases/channels/clear-channel-chat"
import { CreateChannel } from "@/app/use-cases/channels/create-channel"
import { DeleteChannel } from "@/app/use-cases/channels/delete-channel"
import { GetChannelById } from "@/app/use-cases/channels/get-channel-by-id"
import { GetChannelNameAvailability } from "@/app/use-cases/channels/get-channel-name-availability"
import { GetChannelOption } from "@/app/use-cases/channels/get-channel-option"
import { GetChannelSubscribers } from "@/app/use-cases/channels/get-group-subscribers"
import { GetSubscribedChannels } from "@/app/use-cases/channels/get-subscribed-channels"
import { RemoveChannelAdmin } from "@/app/use-cases/channels/remove-channel-admin"
import { SearchPublicChannels } from "@/app/use-cases/channels/search-public-channels"
import { SubscribeChannel } from "@/app/use-cases/channels/subscribe-channel"
import { UnsubscribeChannel } from "@/app/use-cases/channels/unsubscribe-channel"
import { UpdateChannel } from "@/app/use-cases/channels/update-channel"
import { UpdateChannelOption } from "@/app/use-cases/channels/update-channel-option"
import { AddGroupAdmin } from "@/app/use-cases/groups/add-group-admin"
import { AddGroupMember } from "@/app/use-cases/groups/add-group-member"
import { ClearGroupChat } from "@/app/use-cases/groups/clear-group-chat"
import { CreateGroup } from "@/app/use-cases/groups/create-group"
import { DeleteGroupMember } from "@/app/use-cases/groups/delete-group-member"
import { GetGroupById } from "@/app/use-cases/groups/get-group-by-id"
import { GetGroupMembers } from "@/app/use-cases/groups/get-group-members"
import { GetGroupOption } from "@/app/use-cases/groups/get-group-option"
import { GetJoinedGroups } from "@/app/use-cases/groups/get-joined-groups"
import { GetNameAvailability } from "@/app/use-cases/groups/get-name-availability"
import { JoinGroup } from "@/app/use-cases/groups/join-group"
import { LeaveGroup } from "@/app/use-cases/groups/leave-group"
import { RemoveGroupAdmin } from "@/app/use-cases/groups/remove-group-admin"
import { SearchPublicGroups } from "@/app/use-cases/groups/search-public-groups"
import { UpdateGroup } from "@/app/use-cases/groups/update-group"
import { UpdateGroupOption } from "@/app/use-cases/groups/update-group-option"
import { ClearChat } from "@/app/use-cases/private-chat/clear-chat"
import { GetPrivateChatOption } from "@/app/use-cases/private-chat/get-private-chat-option"
import { UpdatePrivateChatOption } from "@/app/use-cases/private-chat/update-private-chat-option"
import { ArchiveRoom } from "@/app/use-cases/rooms/archive-room"
import { GetArchivedRooms } from "@/app/use-cases/rooms/get-archived-rooms"
import { GetPinnedRooms } from "@/app/use-cases/rooms/get-pinned-rooms"
import { GetPrivateRooms } from "@/app/use-cases/rooms/get-private-rooms"
import { GetRoomByActionId } from "@/app/use-cases/rooms/get-room-by-action-id"
import { GetRooms } from "@/app/use-cases/rooms/get-rooms"
import { PinRoom } from "@/app/use-cases/rooms/pin-room"
import { UnarchiveRoom } from "@/app/use-cases/rooms/unarchive-room"
import { UnpinRoom } from "@/app/use-cases/rooms/unpin-room"
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
import { ChannelOptionRepository } from "@/domains/channels/repositories/channel-option-repository"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { ChannelSubscriberRepository } from "@/domains/channels/repositories/channel-subscriber-repository"
import { GroupMemberRepository } from "@/domains/groups/repositories/group-member-repository"
import { GroupOptionRepository } from "@/domains/groups/repositories/group-option-repository"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { PrivateChatOptionRepository } from "@/domains/private-chat/repositories/private-chat-option-repository"
import { RoomRepository } from "@/domains/rooms/repositories/room-repository"
import { SettingRepository } from "@/domains/settings/repositories/setting-repository"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"

import { AuthRepositoryImpl } from "../repositories/auth/auth-repository-impl"
import { SessionRepositoryImpl } from "../repositories/auth/session-repository-impl"
import { TokenRepositoryImpl } from "../repositories/auth/token-repository-impl"
import { BlockedUserRepositoryImpl } from "../repositories/blocked-user/blocked-user-repository-impl"
import { ChannelOptionRepositoryImpl } from "../repositories/channels/channel-option-repository-impl"
import { ChannelRepositoryImpl } from "../repositories/channels/channel-repository-impl"
import { ChannelSubscriberRepositoryImpl } from "../repositories/channels/channel-subscriber-repository-impl"
import { GroupMemberRepositoryImpl } from "../repositories/groups/group-member-repository-impl"
import { GroupOptionRepositoryImpl } from "../repositories/groups/group-option-repository-impl"
import { GroupRepositoryImpl } from "../repositories/groups/group-repository-impl"
import { PrivateChatOptionRepositoryImpl } from "../repositories/private-chat/private-chat-option-repository-impl"
import { RoomRepositoryImpl } from "../repositories/rooms/room-repository-impl"
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
container
  .bind<GroupOptionRepository>(KEYS.GroupOptionRepository)
  .to(GroupOptionRepositoryImpl)
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

container.bind<JoinGroup>(JoinGroup).toSelf()
container.bind<LeaveGroup>(LeaveGroup).toSelf()
container.bind<ClearGroupChat>(ClearGroupChat).toSelf()
container.bind<GetGroupOption>(GetGroupOption).toSelf()
container.bind<UpdateGroupOption>(UpdateGroupOption).toSelf()

// CHANNEL
container
  .bind<ChannelRepository>(KEYS.ChannelRepository)
  .to(ChannelRepositoryImpl)
  .inSingletonScope()
container
  .bind<ChannelSubscriberRepository>(KEYS.ChannelSubscriberRepository)
  .to(ChannelSubscriberRepositoryImpl)
  .inSingletonScope()
container
  .bind<ChannelOptionRepository>(KEYS.ChannelOptionRepository)
  .to(ChannelOptionRepositoryImpl)
  .inSingletonScope()

container.bind<GetSubscribedChannels>(GetSubscribedChannels).toSelf()
container.bind<CreateChannel>(CreateChannel).toSelf()
container.bind<GetChannelNameAvailability>(GetChannelNameAvailability).toSelf()
container.bind<SearchPublicChannels>(SearchPublicChannels).toSelf()
container.bind<GetChannelById>(GetChannelById).toSelf()
container.bind<UpdateChannel>(UpdateChannel).toSelf()
container.bind<DeleteChannel>(DeleteChannel).toSelf()

container.bind<GetChannelSubscribers>(GetChannelSubscribers).toSelf()
container.bind<AddChannelAdmin>(AddChannelAdmin).toSelf()
container.bind<RemoveChannelAdmin>(RemoveChannelAdmin).toSelf()
container.bind<SubscribeChannel>(SubscribeChannel).toSelf()
container.bind<UnsubscribeChannel>(UnsubscribeChannel).toSelf()

container.bind<ClearChannelChat>(ClearChannelChat).toSelf()
container.bind<GetChannelOption>(GetChannelOption).toSelf()
container.bind<UpdateChannelOption>(UpdateChannelOption).toSelf()

// ROOM
container
  .bind<RoomRepository>(KEYS.RoomRepository)
  .to(RoomRepositoryImpl)
  .inSingletonScope()

container.bind<GetRooms>(GetRooms).toSelf()
container.bind<GetPrivateRooms>(GetPrivateRooms).toSelf()
container.bind<GetPinnedRooms>(GetPinnedRooms).toSelf()
container.bind<PinRoom>(PinRoom).toSelf()
container.bind<UnpinRoom>(UnpinRoom).toSelf()
container.bind<GetArchivedRooms>(GetArchivedRooms).toSelf()
container.bind<ArchiveRoom>(ArchiveRoom).toSelf()
container.bind<UnarchiveRoom>(UnarchiveRoom).toSelf()
container.bind<GetRoomByActionId>(GetRoomByActionId).toSelf()

export { container }

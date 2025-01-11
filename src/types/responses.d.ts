declare interface ErrorResponse {
  success: false
  error: {
    message: string
    path?: (string | number)[]
  }
}

declare type ApiResponse<T> = {
  success: true
  data: T
}

declare type ApiCollectionResponse<T> = {
  success: true
  data: T[]
  total: number
  cursor?: string
}

// AUTH API
declare type SignUpResponse = ApiResponse<{ username: string; email: string }>

declare type SignInStatus = "unverified" | "2fa" | "success"
declare type SignInResponse = ApiResponse<{
  status: SignInStatus
}>

declare type LogoutResponse = ApiResponse<boolean>

// USER API
declare type UsernameAvailabilityResponse = ApiResponse<boolean>

declare type CreateUserProfileResponse = ApiResponse<ProfileDTO>

declare type SearchUsersResponse = ApiCollectionResponse<UserSearchDTO>

declare type SearchUsersForMemberResponse =
  ApiCollectionResponse<UserSearchForMemberDTO>

declare type GetMyProfileResponse = ApiResponse<ProfileDTO>

declare type GetUserProfileResponse = ApiResponse<ProfileDTO>

// SETTING API
declare type GetSettingResponse = ApiResponse<SettingDTO>

declare type UpdateSettingResponse = ApiResponse<SettingDTO>

// BLOCKED USERS
declare type GetBlockedUsersResponse = ApiCollectionResponse<BlockedUserDTO>

declare type GetIsBlockedUserResponse = ApiResponse<boolean>

declare type BlockUserResponse = ApiResponse<{ id: string }>

declare type UnblockUserResponse = ApiResponse<{ id: string }>

// PRIVATE CHAT API
declare type GetPrivateChatOptionResponse = ApiResponse<PrivateChatOptionDTO>

declare type UpdatePrivateChatOptionResponse = ApiResponse<PrivateChatOptionDTO>

declare type DeleteAllPrivateChatResponse = ApiResponse<boolean>

// GROUP API
declare type GetGroupsResponse = ApiCollectionResponse<GroupDTO>

declare type CreateGroupResponse = ApiResponse<GroupDTO>

declare type GetNameAvailabilityResponse = ApiResponse<boolean>

declare type SearchGroupsResponse = ApiCollectionResponse<GroupSearchDTO>

declare type GetGroupResponse = ApiResponse<GroupDTO>

declare type DeleteGroupResponse = ApiResponse<{ id: string }>

declare type GetGroupMembersResponse = ApiCollectionResponse<GroupMemberDTO>

declare type AddGroupMemberResponse = ApiResponse<boolean>

declare type DeleteGroupMemberResponse = ApiResponse<boolean>

declare type SetAdminGroupResponse = ApiResponse<boolean>

declare type UnsetAdminGroupResponse = ApiResponse<boolean>

declare type JoinGroupResponse = ApiResponse<boolean>

declare type LeaveGroupResponse = ApiResponse<boolean>

declare type DeleteGroupChatResponse = ApiResponse<boolean>

declare type GetGroupOptionResponse = ApiResponse<GroupOptionDTO | null>

// CHANNEL API
declare type GetChannelsResponse = ApiCollectionResponse<ChannelDTO>

declare type CreateChannelResponse = ApiResponse<ChannelDTO>

declare type SearchChannelsResponse = ApiCollectionResponse<ChannelSearchDTO>

declare type GetChannelResponse = ApiResponse<ChannelDTO>

declare type PatchChannelResponse = ApiResponse<ChannelDTO>

declare type DeleteChannelResponse = ApiResponse<{ id: string }>

declare type GetChannelSubscribersResponse =
  ApiCollectionResponse<ChannelSubscriberDTO>

declare type SetAdminChannelResponse = ApiResponse<boolean>

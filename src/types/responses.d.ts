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

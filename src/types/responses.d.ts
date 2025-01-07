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

declare type CreateUserProfileResponse = ApiResponse<Profile>

declare type SearchUsersResponse = ApiCollectionResponse<UserSearch>

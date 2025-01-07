declare type Gender = "MALE" | "FEMALE"

declare interface ProfileDTO {
  id: string
  name: string
  username: string
  email: string
  gender: Gender
  bio: string | null
  imageUrl: string | null
  lastSeenAt: string | null
}

declare interface UserSearchDTO {
  id: string
  name: string
  imageUrl: string | null
  lastSeenAt: string | null
}

declare interface UserSearchForMemberDTO {
  id: string
  name: string
  imageUrl: string | null
  lastSeenAt: string | null
  allowAddToGroup: boolean
}

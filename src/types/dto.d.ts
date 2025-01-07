declare type Gender = "MALE" | "FEMALE"

declare interface Profile {
  id: string
  name: string
  username: string
  email: string
  gender: Gender
  bio: string | null
  imageUrl: string | null
  lastSeenAt: string | null
}

declare interface UserSearch {
  id: string
  name: string
  imageUrl: string | null
  lastSeenAt: string | null
}

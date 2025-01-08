declare type Gender = "MALE" | "FEMALE"

declare type TimeFormatDTO = "12-HOUR" | "24-HOUR"

declare type LanguageDTO = "en_US" | "id_ID"

declare type NotificationsDTO = "PRIVATE" | "GROUP" | "CHANNEL"

declare type GroupType = "PUBLIC" | "PRIVATE"

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

// SETTING
declare interface SettingDTO {
  id: string
  userId: string
  timeFormat: TimeFormatDTO
  language: LanguageDTO
  notifications: NotificationsDTO[]
  enable2FA: boolean
  showLastSeen: boolean
  allowAddToGroup: boolean
}

// BLOCKED USER
declare interface BlockedUserDTO {
  id: string
  name: string
  imageUrl: string | null
}

// PRIVATE CHAT
declare interface PrivateChatOptionDTO {
  userId: string
  privateChatId: string
  notification: boolean
}

// GROUP
declare interface GroupOwnerDTO {
  id: string
  name: string
  imageUrl: string | null
}

declare interface GroupDTO {
  id: string
  name: string
  description: string | null
  type: GroupType
  ownerId: string
  imageUrl: string | null
  inviteCode: string
  totalMembers: number
  isMember: boolean
  isAdmin: boolean
}

declare interface GroupSearchDTO {
  id: string
  name: string
  imageUrl: string | null
  totalMembers: number
}

declare interface GroupMemberDTO {
  id: string
  name: string
  imageUrl: string | null
  isAdmin: boolean
  lastSeenAt: string | null
}

declare type RoomTypeDTO = "chat" | "group" | "channel"

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
  timeFormat: TimeFormat
  language: Language
  notifications: Notifications[]
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

declare interface GroupOptionDTO {
  id: string
  userId: string
  groupId: string
  notification: boolean
}

// CHANNEL
declare interface ChannelOwnerDTO {
  id: string
  name: string
  imageUrl: string | null
}

declare interface ChannelDTO {
  id: string
  name: string
  description: string | null
  type: ChannelType
  ownerId: string
  imageUrl: string | null
  inviteCode: string
  totalSubscribers: number
  isSubscriber: boolean
  isAdmin: boolean
}

declare interface ChannelSearchDTO {
  id: string
  name: string
  imageUrl: string | null
  totalSubscribers: number
}

declare interface ChannelSubscriberDTO {
  id: string
  name: string
  imageUrl: string | null
  isAdmin: boolean
  lastSeenAt: string | null
}

declare interface ChannelOptionDTO {
  id: string
  userId: string
  channelId: string
  notification: boolean
}

// ROOMS
declare interface LastMessageDTO {
  id: string
  name: string
  message: string | null
  time: string
}

declare interface RoomDTO {
  id: string
  /** userId or groupId or channelId */
  actionId: string
  type: RoomTypeDTO
  name: string
  imageUrl: string | null
  pinned: boolean
  archived: boolean
  /** determine if user is group members/channel subs or not */
  isActive: boolean
  totalUnreadMessages: number
  lastMessage: LastMessageDTO | null
}

declare interface PrivateRoomDTO {
  id: string
  name: string
  imageUrl: string | null
  lastSeenAt: string | null
}

// MESSAGES
declare interface MessageAuthorDTO {
  id: string
  name: string
  imageUrl: string | null
}

declare interface MessageDTO {
  id: string
  message: string | null
  sender: MessageAuthorDTO
  isSender: boolean
  privateChatId: string | null
  groupId: string | null
  channelId: string | null
  parentMessageId: string | null
  parentMessageName: string | null
  parentMessageText: string | null
  originalMessageId: string | null
  isEmojiOnly: boolean
  status: MessageStatus
  attachments: AttachmentDTO[]
  isUpdated: boolean
  createdAt: string
}

declare interface AttachmentDTO {
  id: string
  url: string
  downloadUrl: string
  name: string
  type: AttachmentType
  size: number
}

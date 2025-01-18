import { RoomProfileEntity } from "./room-profile-entity"

export class SearchPrivateRoomEntity {
  constructor(
    public readonly ownerId: string,
    public readonly user1: RoomProfileEntity,
    public readonly user2: RoomProfileEntity,
  ) {}

  toDTO(): PrivateRoomDTO {
    let id = ""
    let name = ""
    let imageUrl: string | null = null
    let lastSeenAt: string | null = null

    const user = this.user1.id === this.ownerId ? this.user2 : this.user1
    id = user?.id ?? ""
    if (this.user2.id === this.user1.id) {
      name = "Saved Messages"
    } else {
      name = user?.name ?? "Unknown"
      lastSeenAt = user?.lastSeenAt?.toISOString() ?? null
    }

    imageUrl = user?.imageUrl ?? null

    return {
      id,
      name,
      imageUrl,
      lastSeenAt,
    }
  }
}

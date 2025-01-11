import { RoomType } from "./enums"
import { RoomProfileEntity } from "./room-profile-entity"

export class RoomEntity {
  constructor(
    public readonly id: string,
    public readonly type: RoomType,
    public readonly ownerId: string,
    public readonly pinned: boolean,
    public readonly archived: boolean,
    public readonly totalUnreadMessage: number,
    public readonly user1?: RoomProfileEntity,
    public readonly user2?: RoomProfileEntity,
    public readonly group?: RoomProfileEntity,
    public readonly channel?: RoomProfileEntity,
  ) {}

  public toDTO(): RoomDTO {
    let id = ""
    let name = ""
    let imageUrl: string | null = null
    let isActive = false

    if (this.type === RoomType.PRIVATE) {
      const user = this.user1?.id === this.ownerId ? this.user2 : this.user1
      id = user?.id ?? ""
      imageUrl = user?.imageUrl ?? ""

      if (this.user1?.id === this.user2?.id) {
        name = "Saved Messages"
      } else {
        name = user?.name ?? "Unknown"
      }
    } else if (this.type === RoomType.GROUP && this.group) {
      id = this.group.id
      name = this.group.name
      imageUrl = this.group?.imageUrl ?? null
      isActive = this.group.isActive
    } else if (this.type === RoomType.CHANNEL && this.channel) {
      id = this.channel.id
      name = this.channel.name
      imageUrl = this.channel?.imageUrl ?? null
      isActive = this.channel.isActive
    }

    return {
      id,
      type: this.type,
      name,
      imageUrl,
      pinned: this.pinned,
      archived: this.archived,
      isActive,
      totalUnreadMessages: this.totalUnreadMessage,
    }
  }
}

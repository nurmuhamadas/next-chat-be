export class RoomProfileEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly imageUrl?: string | null,
    public readonly lastSeenAt?: Date | null,
  ) {}

  static fromJSON(json: {
    id?: string | null
    name?: string | null
    imageUrl?: string | null
    isActive?: boolean | null
    lastSeenAt?: string
  }) {
    return new RoomProfileEntity(
      json.id ?? "0",
      json.name ?? "Unknown",
      json.isActive ?? false,
      json.imageUrl,
      json.lastSeenAt ? new Date(json.lastSeenAt) : null,
    )
  }
}

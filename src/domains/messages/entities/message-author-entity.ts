export class MessageAuthorEntity {
  constructor(
    public readonly id?: string | null,
    public readonly name?: string | null,
    public readonly imageUrl?: string | null,
  ) {}

  toDTO(): MessageAuthorDTO {
    return {
      id: this.id ?? "0",
      name: this.name ?? "Unknown",
      imageUrl: this.imageUrl ?? null,
    }
  }
}

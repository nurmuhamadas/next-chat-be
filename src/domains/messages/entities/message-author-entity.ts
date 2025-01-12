export class MessageAuthorEntity {
  constructor(
    public readonly id?: string,
    public readonly name?: string,
    public readonly imageUrl?: string,
  ) {}

  toDTO(): MessageAuthorDTO {
    return {
      id: this.id ?? "0",
      name: this.name ?? "Unknown",
      imageUrl: this.imageUrl ?? null,
    }
  }
}

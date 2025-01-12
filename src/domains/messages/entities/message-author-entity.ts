export class MessageAuthorEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly imageUrl?: string,
  ) {}

  toDTO(): MessageAuthorDTO {
    return {
      id: this.id,
      name: this.name,
      imageUrl: this.imageUrl ?? null,
    }
  }
}

export class LastMessageEntity {
  constructor(
    public readonly id: string,
    public readonly time: Date,
    public readonly name?: string,
    public readonly message?: string,
  ) {}

  toDTO(): LastMessageDTO {
    return {
      id: this.id,
      name: this.name ?? "Unknown",
      message: this.message ?? null,
      time: this.time.toISOString(),
    }
  }
}

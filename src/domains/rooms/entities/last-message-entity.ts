export class LastMessageEntity {
  constructor(
    public readonly id: string,
    public readonly time: Date,
    public readonly name?: string | null,
    public readonly message?: string | null,
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

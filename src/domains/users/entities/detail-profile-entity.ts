export class DetailProfileEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly gender: Gender,
    public readonly username: string,
    public readonly bio?: string | null,
    public readonly imageUrl?: string | null,
    public readonly lastSeenAt?: Date | null,
  ) {}

  public toProfileDTO(): ProfileDTO {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      email: this.username,
      gender: this.gender,
      bio: this.bio ?? null,
      imageUrl: this.imageUrl ?? null,
      lastSeenAt: this.lastSeenAt ? this.lastSeenAt.toISOString() : null,
    }
  }
}

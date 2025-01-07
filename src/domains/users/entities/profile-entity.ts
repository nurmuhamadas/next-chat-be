export class ProfileEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public gender: Gender,
    public bio?: string,
    public imageUrl?: string,
    public lastSeenAt?: Date,
  ) {}

  public toProfileDTO(username: string, email: string): ProfileDTO {
    return {
      id: this.id,
      name: this.name,
      gender: this.gender,
      bio: this.bio ?? null,
      imageUrl: this.imageUrl ?? null,
      lastSeenAt: this.lastSeenAt ? this.lastSeenAt.toISOString() : null,
      username,
      email,
    }
  }
}

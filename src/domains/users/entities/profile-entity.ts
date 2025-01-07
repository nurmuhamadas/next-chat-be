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
}

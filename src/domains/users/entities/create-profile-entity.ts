export class CreateProfileEntity {
  constructor(
    public readonly userId: string,
    public name: string,
    public gender: Gender,
    public bio?: string | null,
    public imageUrl?: string | null,
  ) {}
}

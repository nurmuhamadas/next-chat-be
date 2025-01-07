export type Gender = "MALE" | "FEMALE"

export class CreateProfileEntity {
  constructor(
    public readonly userId: string,
    public name: string,
    public gender: Gender,
    public bio?: string,
    public imageUrl?: string,
  ) {}
}

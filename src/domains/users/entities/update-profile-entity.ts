export class UpdateProfileEntity {
  constructor(
    public name?: string,
    public gender?: Gender,
    public bio?: string,
    public imageUrl?: string,
  ) {}
}

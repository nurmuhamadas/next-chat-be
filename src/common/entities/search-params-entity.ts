export class SearchParamsEntity {
  constructor(
    public readonly query?: string,
    public readonly cursor?: string,
    public readonly limit: number = 20,
  ) {}
}

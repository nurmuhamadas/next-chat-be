export class SearchResultEntity<T> {
  constructor(
    public data: T[],
    public total: number,
    public cursor?: string,
  ) {}
}

export class SearchParamsEntity {
  constructor(
    public readonly query?: string,
    public readonly cursor?: string,
    public readonly limit: number = 20,
  ) {}

  static fromJSON({
    cursor,
    limit,
    query,
  }: {
    query?: string
    cursor?: string
    limit?: number
  }) {
    return new SearchParamsEntity(query, cursor, limit)
  }
}

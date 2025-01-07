export class UploadedFileEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly size: number,
    public readonly type: string,
    public readonly url: string,
  ) {}
}

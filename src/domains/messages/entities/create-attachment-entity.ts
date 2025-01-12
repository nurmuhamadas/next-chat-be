export class UploadAttachmentEntity {
  constructor(
    public readonly name: string,
    public readonly size: number,
    public readonly type: string,
    public readonly url: string,
    public readonly downloadUrl: string,
  ) {}

  static fromJSON(json: {
    name: string
    size: number
    type: string
    url: string
    downloadUrl: string
  }) {
    return new UploadAttachmentEntity(
      json.name,
      json.size,
      json.type,
      json.url,
      json.downloadUrl,
    )
  }
}

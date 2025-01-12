import { AttachmentType } from "./enums"

export class AttachmentEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly size: number,
    public readonly type: AttachmentType,
    public readonly url: string,
    public readonly downloadUrl: string,
  ) {}

  toDTO(): AttachmentDTO {
    return {
      id: this.id,
      url: this.url,
      downloadUrl: this.downloadUrl,
      name: this.name,
      type: this.type,
      size: this.size,
    }
  }
}

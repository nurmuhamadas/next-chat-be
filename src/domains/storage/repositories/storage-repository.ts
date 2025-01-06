import { UploadedFileEntity } from "../entities/uploaded-file-entity"

export abstract class StorageRepository {
  abstract uploadFile(file: File): Promise<UploadedFileEntity>

  abstract deleteFile(id: string): Promise<void>
}

import { inject, injectable } from "inversify"
import { ID } from "node-appwrite"

import { UploadedFileEntity } from "@/domains/storage/entities/uploaded-file-entity"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { KEYS } from "@/infrastuctures/container/keys"
import { AppwriteClient } from "@/infrastuctures/storage/appwrite"

import { STORAGE_ID } from "../../../../config"

@injectable()
export class StorageRepositoryImpl implements StorageRepository {
  constructor(@inject(KEYS.AppwriteClient) private appwrite: AppwriteClient) {}

  async uploadFile(file: File): Promise<UploadedFileEntity> {
    const { storage } = await this.appwrite.createAdminClient()

    const blob = new Blob([file], { type: file.type })
    const newFile = new File([blob], file.name, { type: file.type })

    const uploadedFile = await storage.createFile(
      STORAGE_ID,
      ID.unique(),
      newFile,
    )

    return new UploadedFileEntity(
      uploadedFile.$id,
      uploadedFile.name,
      uploadedFile.sizeOriginal,
      uploadedFile.mimeType,
      this.appwrite.constructFileUrl(uploadedFile.$id),
    )
  }

  async deleteFile(id: string): Promise<void> {
    const { storage } = await this.appwrite.createAdminClient()

    await storage.deleteFile(STORAGE_ID, id)
  }

  async deleteFileByUrl(url: string): Promise<void> {
    const { storage } = await this.appwrite.createAdminClient()

    const id = this.appwrite.destructFileId(url)

    await storage.deleteFile(STORAGE_ID, id)
  }
}

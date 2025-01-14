import { injectable } from "inversify"
import { Client, Storage } from "node-appwrite"

import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_SECRET_KEY,
  STORAGE_ID,
} from "../../../config"

@injectable()
export class AppwriteClient {
  async createAdminClient() {
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(APPWRITE_SECRET_KEY)

    return {
      get storage() {
        return new Storage(client)
      },
    }
  }

  constructFileUrl = (bucketFileId: string) => {
    return `${APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_ID}/files/${bucketFileId}/view?project=${APPWRITE_PROJECT_ID}`
  }

  destructFileId = (fileUrl: string) => {
    return fileUrl.split(APPWRITE_ENDPOINT)[1].split("/")[5]
  }

  constructDownloadUrl = (bucketFileId: string) => {
    return `${APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_ID}/files/${bucketFileId}/download?project=${APPWRITE_PROJECT_ID}`
  }
}

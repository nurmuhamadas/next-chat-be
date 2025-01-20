import { injectable } from "inversify"
import { Client, Storage } from "node-appwrite"

@injectable()
export class AppwriteClient {
  async createAdminClient() {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_SECRET_KEY!)

    return {
      get storage() {
        return new Storage(client)
      },
    }
  }

  constructFileUrl = (bucketFileId: string) => {
    return `${process.env.APPWRITE_ENDPOINT!}/storage/buckets/${process.env.STORAGE_ID!}/files/${bucketFileId}/view?project=${process.env.APPWRITE_PROJECT_ID!}`
  }

  destructFileId = (fileUrl: string) => {
    return fileUrl.split(process.env.APPWRITE_ENDPOINT!)[1].split("/")[5]
  }

  constructDownloadUrl = (bucketFileId: string) => {
    return `${process.env.APPWRITE_ENDPOINT!}/storage/buckets/${process.env.STORAGE_ID!}/files/${bucketFileId}/download?project=${process.env.APPWRITE_PROJECT_ID!}`
  }
}

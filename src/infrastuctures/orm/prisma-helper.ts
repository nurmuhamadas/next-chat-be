import { LogActivity as LogActivityModel } from "@prisma/client"

import { LogActivity } from "@/domains/auth/entities/user-log-entity"

export class PrismaHelper {
  static convertLogActivity(activity: LogActivity): LogActivityModel {
    return activity as unknown as LogActivityModel
  }
}

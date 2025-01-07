import {
  DBTimeFormat,
  LogActivity as LogActivityModel,
  PrismaPromise,
} from "@prisma/client"

import { LogActivity } from "@/domains/auth/entities/user-log-entity"
import { TimeFormat } from "@/domains/settings/entities/setting-entity"

import { prisma } from "./prisma"

export class PrismaHelper {
  static convertLogActivity(activity: LogActivity): LogActivityModel {
    return activity as unknown as LogActivityModel
  }

  static transaction<T>(transactions: PrismaPromise<T>[]) {
    return prisma.$transaction(transactions)
  }

  static convertTimeFormat(timeFormat: TimeFormat): DBTimeFormat {
    return timeFormat === "12-HOUR"
      ? DBTimeFormat.HALF_DAY
      : DBTimeFormat.FULL_DAY
  }
  static convertDBTimeFormat(timeFormat: DBTimeFormat): TimeFormat {
    return timeFormat === DBTimeFormat.HALF_DAY ? "12-HOUR" : "24-HOUR"
  }
}

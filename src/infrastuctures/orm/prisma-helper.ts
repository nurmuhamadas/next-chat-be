import {
  ChannelType as DBChannelType,
  DBTimeFormat,
  GroupType as DBGroupType,
  Language as DBLanguage,
  LogActivity as LogActivityModel,
  Notification as DBNotification,
  PrismaClient,
  RoomType as DBRoomType,
} from "@prisma/client"
import { ITXClientDenyList } from "@prisma/client/runtime/library"

import { prisma } from "./prisma"

export class PrismaHelper {
  static convertLogActivity(activity: LogActivity): LogActivityModel {
    return activity
  }

  static transaction<T>(
    fn: (prisma: Omit<PrismaClient, ITXClientDenyList>) => Promise<T>,
  ) {
    return prisma.$transaction(fn)
  }

  static convertTimeFormat(timeFormat: TimeFormat): DBTimeFormat {
    return timeFormat === "12-HOUR"
      ? DBTimeFormat.HALF_DAY
      : DBTimeFormat.FULL_DAY
  }

  static convertDBTimeFormat(timeFormat: DBTimeFormat): TimeFormat {
    return timeFormat === DBTimeFormat.HALF_DAY ? "12-HOUR" : "24-HOUR"
  }

  static convertLanguage(language: Language): DBLanguage {
    return language
  }

  static convertDBLanguage(language: DBLanguage): Language {
    return language
  }

  static convertNotifications(notification: Notifications): DBNotification {
    return notification
  }

  static convertDBNotification(notification: DBNotification): Notifications {
    return notification
  }

  static convertDBGroupType(type: DBGroupType): GroupType {
    return type
  }

  static convertDBChannelType(type: DBChannelType): ChannelType {
    return type
  }

  static convertDBRoomType(type: DBRoomType): RoomType {
    return type
  }
}

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

import { GroupType } from "@/domains/groups/entities/enums"
import { RoomType } from "@/domains/rooms/entities/enums"
import {
  Language,
  Notifications,
  TimeFormat,
} from "@/domains/settings/entities/enums"

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
    return timeFormat === DBTimeFormat.HALF_DAY
      ? TimeFormat.HALF_DAY
      : TimeFormat.FULL_DAY
  }

  static convertLanguage(language: Language): DBLanguage {
    return language === Language.ENGLISH ? DBLanguage.en_US : DBLanguage.id_ID
  }

  static convertDBLanguage(language: DBLanguage): Language {
    return language === DBLanguage.en_US
      ? Language.ENGLISH
      : Language.INDONESIAN
  }

  static convertNotifications(notification: Notifications): DBNotification {
    return notification === Notifications.PRIVATE
      ? DBNotification.PRIVATE
      : notification === Notifications.GROUP
        ? DBNotification.GROUP
        : DBNotification.CHANNEL
  }

  static convertDBNotification(notification: DBNotification): Notifications {
    return notification === DBNotification.PRIVATE
      ? Notifications.PRIVATE
      : notification === DBNotification.GROUP
        ? Notifications.GROUP
        : Notifications.CHANNEL
  }

  static convertDBGroupType(type: DBGroupType): GroupType {
    return type === "PRIVATE" ? GroupType.PRIVATE : GroupType.PUBLIC
  }

  static convertDBChannelType(type: DBChannelType): ChannelType {
    return type
  }

  static convertDBRoomType(type: DBRoomType): RoomType {
    return type === "PRIVATE"
      ? RoomType.PRIVATE
      : type === "GROUP"
        ? RoomType.GROUP
        : RoomType.CHANNEL
  }
}

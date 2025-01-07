import { z } from "zod"

import { ERROR } from "@/common/constants/errors"

export const TIME_FORMAT: Record<TimeFormatDTO, TimeFormatDTO> = {
  "12-HOUR": "12-HOUR",
  "24-HOUR": "24-HOUR",
}

export const LANGUAGE: Record<LanguageDTO, LanguageDTO> = {
  en_US: "en_US",
  id_ID: "id_ID",
}

export const NOTIFICATION: Record<NotificationsDTO, NotificationsDTO> = {
  PRIVATE: "PRIVATE",
  GROUP: "GROUP",
  CHANNEL: "CHANNEL",
}

export const settingSchema = z.object({
  timeFormat: z
    .nativeEnum(TIME_FORMAT, {
      invalid_type_error: ERROR.INVALID_TIME_FORMAT,
    })
    .optional(),
  language: z
    .nativeEnum(LANGUAGE, {
      invalid_type_error: ERROR.INVALID_LANGUAGE,
    })
    .optional(),
  notifications: z
    .nativeEnum(NOTIFICATION, {
      invalid_type_error: ERROR.INVALID_NOTIFICATION_TYPE,
    })
    .array()
    .optional(),
  enable2FA: z.boolean({ invalid_type_error: ERROR.INVALID_TYPE }).optional(),
  showLastSeen: z
    .boolean({ invalid_type_error: ERROR.INVALID_TYPE })
    .optional(),
  allowToAddToGroup: z
    .boolean({ invalid_type_error: ERROR.INVALID_TYPE })
    .optional(),
})

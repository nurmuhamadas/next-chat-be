import { z } from "zod"

import { ERROR } from "@/common/constants/errors"
import { ChannelType } from "@/domains/channels/entities/enums"

import { imageProfileSchema } from "./common-schema"

export const channelSchema = z.object({
  name: z
    .string({ required_error: ERROR.CHANNEL_NAME_REQUIRED })
    .trim()
    .min(3, ERROR.CHANNEL_NAME_TOO_SHORT)
    .max(256, ERROR.CHANNEL_NAME_TOO_LONG),
  description: z
    .string()
    .trim()
    .max(2048, ERROR.CHANNEL_DESC_TOO_LONG)
    .optional(),
  type: z.nativeEnum(ChannelType, {
    required_error: ERROR.CHANNEL_TYPE_REQUIRED,
    invalid_type_error: ERROR.INVALID_CHANNEL_TYPE,
  }),
  image: imageProfileSchema,
})

export const subscribeChannelSchema = z.object({
  code: z
    .string({
      required_error: ERROR.JOIN_CODE_REQUIRED,
      invalid_type_error: ERROR.INVALID_JOIN_CODE,
    })
    .length(10, ERROR.INVALID_JOIN_CODE)
    .optional(),
})

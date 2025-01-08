import { GroupType } from "@prisma/client"
import { z } from "zod"

import { ERROR } from "@/common/constants/errors"

import { imageProfileSchema } from "./common-schema"

export const GROUP_TYPE: Record<GroupType, GroupType> = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
}

export const groupSchema = z.object({
  name: z
    .string({ required_error: ERROR.GROUP_NAME_REQUIRED })
    .trim()
    .min(1, ERROR.GROUP_NAME_REQUIRED)
    .min(3, ERROR.GROUP_NAME_TOO_SHORT)
    .max(256, ERROR.GROUP_NAME_TOO_LONG),
  description: z
    .string()
    .trim()
    .max(2048, ERROR.GROUP_DESC_TOO_LONG)
    .optional(),
  type: z.nativeEnum(GroupType, {
    required_error: ERROR.GROUP_TYPE_REQUIRED,
    invalid_type_error: ERROR.INVALID_GROUP_TYPE,
  }),
  memberIds: z.array(z.string()).default([]),
  image: imageProfileSchema,
})

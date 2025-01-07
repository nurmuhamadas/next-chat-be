import { Gender } from "@prisma/client"
import { z } from "zod"

import { ERROR } from "@/common/constants/errors"

import { imageProfileSchema } from "./common-schema"

export const profileSchema = z.object({
  name: z
    .string({ required_error: ERROR.NAME_REQUIRED })
    .trim()
    .min(1, ERROR.NAME_REQUIRED)
    .min(3, ERROR.NAME_TOO_SHORT)
    .max(256, ERROR.NAME_TOO_LONG),
  gender: z.nativeEnum(Gender, { message: ERROR.INVALID_GENDER }),
  bio: z.string().max(2048, ERROR.BIO_TOO_LONG).trim().optional(),
  image: imageProfileSchema,
})

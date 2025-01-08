import { z } from "zod"

import { ERROR } from "@/common/constants/errors"

export const updatePrivateChatOptionSchema = z.object({
  notification: z.boolean({
    required_error: ERROR.NOTIFICATION_REQUIRED,
    invalid_type_error: ERROR.INVALID_NOTIFICATION_TYPE,
  }),
})

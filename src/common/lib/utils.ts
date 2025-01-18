import { zValidator as zv } from "@hono/zod-validator"
import { ValidationTargets } from "hono"
import { ZodSchema } from "zod"

import InvariantError from "../exceptions/invariant-error"

export const createError = (
  message: string,
  path?: (string | number)[],
): ErrorResponse => {
  return {
    success: false,
    error: { message, path },
  }
}

export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest)
}

export const zValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result) => {
    if (!result.success) {
      throw new InvariantError(
        result.error.errors[0]?.message ?? result.error.message,
        result.error.errors[0]?.path,
      )
    }
  })

export const successResponse = <T>(data: T): ApiResponse<T> => {
  return {
    success: true,
    data,
  }
}

export const successCollectionResponse = <T>(
  data: T[],
  total: number,
  cursor?: string,
): ApiCollectionResponse<T> => {
  return {
    success: true,
    data,
    total,
    cursor,
  }
}

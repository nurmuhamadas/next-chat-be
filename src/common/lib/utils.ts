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

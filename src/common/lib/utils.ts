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

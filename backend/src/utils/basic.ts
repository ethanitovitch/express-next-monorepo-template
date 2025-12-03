export const tryCatch = async <T>(
  fn: () => Promise<T>,
): Promise<[T | null, Error | null]> => {
  try {
    const result = await fn()
    return [result, null]
  } catch (error) {
    return [null, error as Error]
  }
}

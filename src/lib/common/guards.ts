export default function isRequestBodyValid<T>(query: T): query is T {
  const keys = Object.keys(query)
  const requiredKeys = Object.keys(query) as (keyof T)[]
  const missingKeys = requiredKeys.filter(
    (key) => !keys.includes(key as string)
  )

  if (missingKeys.length > 0) {
    throw new Error(`Missing keys: ${missingKeys.join(', ')}`)
  }

  return (
    typeof query === 'object' &&
    requiredKeys.every((key) => {
      const value = (query as T)[key]
      if (value === undefined) {
        // Check if the key is optional in the interface
        return !(key in query)
      } else if (typeof value === 'object') {
        if (value === null) {
          return true
        }
        // Recursively check nested objects
        return isRequestBodyValid<T[keyof T]>(value)
      } else {
        return true
      }
    })
  )
}

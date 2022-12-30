import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name: string
      email: string
      image: string
      userId: string
      subscription?: string
      createdAt?: Date
      deletedAt?: Date
      updatedAt?: Date
    }
  }
  interface User {
    name: string
    email: string
    image: string
    userId: string
    subscription?: string
    createdAt?: Date
    deletedAt?: Date
    updatedAt?: Date
  }
}

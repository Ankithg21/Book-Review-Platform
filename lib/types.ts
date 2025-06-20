export interface Book {
  _id: string
  title: string
  author: string
  description: string
  coverImage: string
  genre: string
  publishedDate: string
  isbn: string
  averageRating: number
  totalReviews: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Review {
  _id: string
  bookId: string
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  avatar: string
  bio: string
  joinedDate: string
  totalReviews: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

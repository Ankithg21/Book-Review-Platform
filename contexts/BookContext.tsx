"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Book, Review, User } from "@/lib/types"

interface BookState {
  books: Book[]
  currentBook: Book | null
  reviews: Review[]
  currentUser: User | null
  loading: boolean
  error: string | null
  searchQuery: string
  selectedGenre: string
}

type BookAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_BOOKS"; payload: Book[] }
  | { type: "SET_CURRENT_BOOK"; payload: Book | null }
  | { type: "SET_REVIEWS"; payload: Review[] }
  | { type: "SET_CURRENT_USER"; payload: User | null }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_GENRE"; payload: string }
  | { type: "ADD_REVIEW"; payload: Review }

const initialState: BookState = {
  books: [],
  currentBook: null,
  reviews: [],
  currentUser: null,
  loading: false,
  error: null,
  searchQuery: "",
  selectedGenre: "",
}

function bookReducer(state: BookState, action: BookAction): BookState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_BOOKS":
      return { ...state, books: action.payload, loading: false }
    case "SET_CURRENT_BOOK":
      return { ...state, currentBook: action.payload, loading: false }
    case "SET_REVIEWS":
      return { ...state, reviews: action.payload, loading: false }
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }
    case "SET_SELECTED_GENRE":
      return { ...state, selectedGenre: action.payload }
    case "ADD_REVIEW":
      return {
        ...state,
        reviews: [action.payload, ...state.reviews],
        currentBook: state.currentBook
          ? {
              ...state.currentBook,
              totalReviews: state.currentBook.totalReviews + 1,
            }
          : null,
      }
    default:
      return state
  }
}

const BookContext = createContext<{
  state: BookState
  dispatch: React.Dispatch<BookAction>
} | null>(null)

export function BookProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookReducer, initialState)

  return <BookContext.Provider value={{ state, dispatch }}>{children}</BookContext.Provider>
}

export function useBookContext() {
  const context = useContext(BookContext)
  if (!context) {
    throw new Error("useBookContext must be used within a BookProvider")
  }
  return context
}

"use client"

import { useEffect, useState } from "react"
import { useBookContext } from "@/contexts/BookContext"
import { BookCard } from "@/components/BookCard"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ErrorMessage } from "@/components/ErrorMessage"
import type { Book, ApiResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  const { state, dispatch } = useBookContext()
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const response = await fetch("/api/books?featured=true&limit=6")
        const data: ApiResponse<Book[]> = await response.json()

        if (data.success && data.data) {
          setFeaturedBooks(data.data)
        } else {
          dispatch({ type: "SET_ERROR", payload: data.error || "Failed to fetch featured books" })
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to fetch featured books" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    fetchFeaturedBooks()
  }, [dispatch])

  if (state.loading) {
    return <LoadingSpinner text="Loading featured books..." />
  }

  if (state.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={state.error} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to BookReview</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover your next favorite book, read reviews from fellow readers, and share your own thoughts on the books
          you love.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/books">Browse Books</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/reviews/new">Write a Review</Link>
          </Button>
        </div>
      </section>

      {/* Featured Books */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Books</h2>
          <Button asChild variant="outline">
            <Link href="/books">View All Books</Link>
          </Button>
        </div>

        {featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured books available at the moment.</p>
          </div>
        )}
      </section>
    </div>
  )
}

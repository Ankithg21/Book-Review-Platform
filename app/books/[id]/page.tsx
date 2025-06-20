"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useBookContext } from "@/contexts/BookContext"
import { ReviewCard } from "@/components/ReviewCard"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ErrorMessage } from "@/components/ErrorMessage"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, BookOpen } from "lucide-react"
import type { Book, Review, ApiResponse } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

export default function BookPage() {
  const params = useParams()
  const { state, dispatch } = useBookContext()
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      if (!params.id) return

      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const response = await fetch(`/api/books/${params.id}`)
        const data: ApiResponse<Book> = await response.json()

        if (data.success && data.data) {
          dispatch({ type: "SET_CURRENT_BOOK", payload: data.data })
        } else {
          dispatch({ type: "SET_ERROR", payload: data.error || "Failed to fetch book" })
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to fetch book" })
      }
    }

    const fetchReviews = async () => {
      if (!params.id) return

      setReviewsLoading(true)
      try {
        const response = await fetch(`/api/reviews?bookId=${params.id}`)
        const data: ApiResponse<Review[]> = await response.json()

        if (data.success && data.data) {
          setReviews(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchBook()
    fetchReviews()
  }, [params.id, dispatch])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  if (state.loading) {
    return <LoadingSpinner text="Loading book details..." />
  }

  if (state.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={state.error} />
      </div>
    )
  }

  if (!state.currentBook) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Book not found" />
      </div>
    )
  }

  const book = state.currentBook

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] relative mb-4">
            <Image
              src={book.coverImage || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {renderStars(book.averageRating)}
                <span className="font-semibold">
                  {book.averageRating > 0 ? book.averageRating.toFixed(1) : "No ratings"}
                </span>
                <span className="text-muted-foreground">({book.totalReviews} reviews)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{book.genre}</Badge>
              {book.featured && <Badge className="bg-yellow-500">Featured</Badge>}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Published: {new Date(book.publishedDate).getFullYear()}</span>
            </div>
            {book.isbn && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>ISBN: {book.isbn}</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{book.description}</p>
          </div>

          <Button asChild size="lg">
            <Link href={`/reviews/new?bookId=${book._id}`}>Write a Review</Link>
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Reviews ({book.totalReviews})</h2>

        {reviewsLoading ? (
          <LoadingSpinner text="Loading reviews..." />
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review this book!</p>
            <Button asChild>
              <Link href={`/reviews/new?bookId=${book._id}`}>Write the First Review</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useBookContext } from "@/contexts/BookContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ErrorMessage } from "@/components/ErrorMessage"
import { Star } from "lucide-react"
import type { Book, ApiResponse } from "@/lib/types"

export default function NewReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { dispatch } = useBookContext()

  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    bookId: searchParams.get("bookId") || "",
    rating: 0,
    title: "",
    content: "",
    userName: "Anonymous User", // In a real app, this would come from authentication
  })

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/books?limit=100")
        const data: ApiResponse<Book[]> = await response.json()

        if (data.success && data.data) {
          setBooks(data.data)

          // If bookId is provided in URL, find and set the selected book
          if (formData.bookId) {
            const book = data.data.find((b) => b._id === formData.bookId)
            if (book) {
              setSelectedBook(book)
            }
          }
        }
      } catch (error) {
        setError("Failed to fetch books")
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [formData.bookId])

  const handleBookSelect = (bookId: string) => {
    const book = books.find((b) => b._id === bookId)
    setSelectedBook(book || null)
    setFormData((prev) => ({ ...prev, bookId }))
  }

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.bookId || !formData.rating || !formData.title || !formData.content) {
      setError("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: "user123", // In a real app, this would come from authentication
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add the new review to context
        if (data.data) {
          dispatch({ type: "ADD_REVIEW", payload: data.data })
        }

        // Redirect to the book page
        router.push(`/books/${formData.bookId}`)
      } else {
        setError(data.error || "Failed to submit review")
      }
    } catch (error) {
      setError("Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (currentRating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button key={i} type="button" onClick={() => handleRatingClick(i + 1)} className="focus:outline-none">
        <Star
          className={`w-8 h-8 transition-colors ${
            i < currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"
          }`}
        />
      </button>
    ))
  }

  if (loading) {
    return <LoadingSpinner text="Loading books..." />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <ErrorMessage message={error} />}

            {/* Book Selection */}
            <div className="space-y-2">
              <Label htmlFor="book">Select Book *</Label>
              <Select value={formData.bookId} onValueChange={handleBookSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a book to review" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book._id} value={book._id}>
                      {book.title} by {book.author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Book Display */}
            {selectedBook && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold">{selectedBook.title}</h3>
                <p className="text-muted-foreground">by {selectedBook.author}</p>
              </div>
            )}

            {/* Rating */}
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex gap-1">{renderStars(formData.rating)}</div>
              {formData.rating > 0 && <p className="text-sm text-muted-foreground">{formData.rating} out of 5 stars</p>}
            </div>

            {/* Review Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Review Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your review in a few words"
                required
              />
            </div>

            {/* Review Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Review Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts about this book..."
                rows={6}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

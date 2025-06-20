"use client"

import { useEffect, useState } from "react"
import { useBookContext } from "@/contexts/BookContext"
import { BookCard } from "@/components/BookCard"
import { SearchBar } from "@/components/SearchBar"
import { FilterPanel } from "@/components/FilterPanel"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ErrorMessage } from "@/components/ErrorMessage"
import { Button } from "@/components/ui/button"
import type { Book, ApiResponse } from "@/lib/types"

export default function BooksPage() {
  const { state, dispatch } = useBookContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchBooks = async () => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "12",
        })

        if (state.searchQuery) {
          params.append("search", state.searchQuery)
        }
        if (state.selectedGenre) {
          params.append("genre", state.selectedGenre)
        }

        const response = await fetch(`/api/books?${params}`)
        const data: ApiResponse<Book[]> = await response.json()

        if (data.success && data.data) {
          dispatch({ type: "SET_BOOKS", payload: data.data })
          if (data.pagination) {
            setTotalPages(data.pagination.totalPages)
          }
        } else {
          dispatch({ type: "SET_ERROR", payload: data.error || "Failed to fetch books" })
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to fetch books" })
      }
    }

    fetchBooks()
  }, [dispatch, currentPage, state.searchQuery, state.selectedGenre])

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [state.searchQuery, state.selectedGenre])

  if (state.loading) {
    return <LoadingSpinner text="Loading books..." />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Browse Books</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <SearchBar />
          <FilterPanel />
        </div>
      </div>

      {state.error && (
        <div className="mb-8">
          <ErrorMessage message={state.error} />
        </div>
      )}

      {/* Books Grid */}
      {state.books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {state.books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {state.searchQuery || state.selectedGenre
              ? "No books found matching your criteria."
              : "No books available at the moment."}
          </p>
        </div>
      )}
    </div>
  )
}

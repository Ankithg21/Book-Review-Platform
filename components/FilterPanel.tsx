"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBookContext } from "@/contexts/BookContext"

const genres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Business",
]

export function FilterPanel() {
  const { state, dispatch } = useBookContext()

  return (
    <div className="flex gap-4 items-center">
      <Select
        value={state.selectedGenre}
        onValueChange={(value) => dispatch({ type: "SET_SELECTED_GENRE", payload: value })}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

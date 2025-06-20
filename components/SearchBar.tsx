"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useBookContext } from "@/contexts/BookContext"
import { useState } from "react"

export function SearchBar() {
  const { state, dispatch } = useBookContext()
  const [localQuery, setLocalQuery] = useState(state.searchQuery)

  const handleSearch = () => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: localQuery })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex gap-2 max-w-md">
      <Input
        placeholder="Search books or authors..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button onClick={handleSearch} size="icon">
        <Search className="w-4 h-4" />
      </Button>
    </div>
  )
}

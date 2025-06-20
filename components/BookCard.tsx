import type { Book } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book._id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="aspect-[3/4] relative mb-4">
            <Image
              src={book.coverImage || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover rounded-md"
            />
            {book.featured && <Badge className="absolute top-2 right-2 bg-yellow-500">Featured</Badge>}
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
            <p className="text-muted-foreground">{book.author}</p>
            <Badge variant="outline">{book.genre}</Badge>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm">
                  {book.averageRating > 0 ? book.averageRating.toFixed(1) : "No ratings"}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">({book.totalReviews} reviews)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

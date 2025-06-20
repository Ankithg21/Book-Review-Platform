import type { Review } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{review.userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{review.userName}</p>
              <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold mb-2">{review.title}</h4>
        <p className="text-muted-foreground">{review.content}</p>
      </CardContent>
    </Card>
  )
}

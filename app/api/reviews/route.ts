import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Review, Book } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get("bookId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!bookId || !ObjectId.isValid(bookId)) {
      return NextResponse.json({ success: false, error: "Valid book ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const collection = db.collection<Review>("reviews")

    const skip = (page - 1) * limit
    const total = await collection.countDocuments({ bookId })
    const reviews = await collection.find({ bookId }).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookId, userId, userName, rating, title, content } = body

    // Validation
    if (!bookId || !userId || !userName || !rating || !title || !content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    if (!ObjectId.isValid(bookId)) {
      return NextResponse.json({ success: false, error: "Invalid book ID" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const db = await getDatabase()
    const reviewsCollection = db.collection<Review>("reviews")
    const booksCollection = db.collection<Book>("books")

    // Check if book exists
    const book = await booksCollection.findOne({ _id: new ObjectId(bookId) })
    if (!book) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 })
    }

    const newReview: Omit<Review, "_id"> = {
      bookId,
      userId,
      userName,
      rating,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await reviewsCollection.insertOne(newReview as any)
    const review = await reviewsCollection.findOne({ _id: result.insertedId })

    // Update book's average rating and total reviews
    const allReviews = await reviewsCollection.find({ bookId }).toArray()
    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await booksCollection.updateOne(
      { _id: new ObjectId(bookId) },
      {
        $set: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: allReviews.length,
          updatedAt: new Date().toISOString(),
        },
      },
    )

    return NextResponse.json({
      success: true,
      data: review,
    })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 })
  }
}

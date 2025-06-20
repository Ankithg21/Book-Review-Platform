import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Book } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const genre = searchParams.get("genre") || ""
    const featured = searchParams.get("featured") === "true"

    const db = await getDatabase()
    const collection = db.collection<Book>("books")

    // Build query
    const query: any = {}
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { author: { $regex: search, $options: "i" } }]
    }
    if (genre) {
      query.genre = genre
    }
    if (featured) {
      query.featured = true
    }

    const skip = (page - 1) * limit
    const total = await collection.countDocuments(query)
    const books = await collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    return NextResponse.json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, description, coverImage, genre, publishedDate, isbn } = body

    // Validation
    if (!title || !author || !description || !genre) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const collection = db.collection<Book>("books")

    const newBook: Omit<Book, "_id"> = {
      title,
      author,
      description,
      coverImage: coverImage || "/placeholder.svg?height=400&width=300",
      genre,
      publishedDate,
      isbn,
      averageRating: 0,
      totalReviews: 0,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await collection.insertOne(newBook as any)
    const book = await collection.findOne({ _id: result.insertedId })

    return NextResponse.json({
      success: true,
      data: book,
    })
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json({ success: false, error: "Failed to create book" }, { status: 500 })
  }
}

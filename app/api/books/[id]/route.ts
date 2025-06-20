import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Book } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid book ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const collection = db.collection<Book>("books")
    const book = await collection.findOne({ _id: new ObjectId(id) })

    if (!book) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: book,
    })
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch book" }, { status: 500 })
  }
}

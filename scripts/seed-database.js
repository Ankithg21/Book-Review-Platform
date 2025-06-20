// Sample data seeding script for MongoDB
// This would typically be run separately to populate the database

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    coverImage: "/placeholder.svg?height=400&width=300",
    genre: "Fiction",
    publishedDate: "1925-04-10",
    isbn: "978-0-7432-7356-5",
    averageRating: 4.2,
    totalReviews: 15,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    coverImage: "/placeholder.svg?height=400&width=300",
    genre: "Fiction",
    publishedDate: "1960-07-11",
    isbn: "978-0-06-112008-4",
    averageRating: 4.5,
    totalReviews: 23,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
    coverImage: "/placeholder.svg?height=400&width=300",
    genre: "Science Fiction",
    publishedDate: "1949-06-08",
    isbn: "978-0-452-28423-4",
    averageRating: 4.3,
    totalReviews: 31,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
    coverImage: "/placeholder.svg?height=400&width=300",
    genre: "Romance",
    publishedDate: "1813-01-28",
    isbn: "978-0-14-143951-8",
    averageRating: 4.1,
    totalReviews: 18,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "A controversial novel about teenage rebellion and alienation in post-war America.",
    coverImage: "/placeholder.svg?height=400&width=300",
    genre: "Fiction",
    publishedDate: "1951-07-16",
    isbn: "978-0-316-76948-0",
    averageRating: 3.8,
    totalReviews: 12,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description: "An epic science fiction novel set in a distant future amidst a feudal interstellar society.",
    coverImage: "/placeholder.svg?height=400&width=300",
    genre: "Science Fiction",
    publishedDate: "1965-08-01",
    isbn: "978-0-441-17271-9",
    averageRating: 4.4,
    totalReviews: 27,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const sampleReviews = [
  {
    bookId: "507f1f77bcf86cd799439011", // The Great Gatsby
    userId: "507f1f77bcf86cd799439012",
    userName: "BookLover123",
    rating: 5,
    title: "A Timeless Classic",
    content:
      "Fitzgerald's masterpiece continues to resonate with readers today. The symbolism and prose are absolutely beautiful.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    bookId: "507f1f77bcf86cd799439011", // The Great Gatsby
    userId: "507f1f77bcf86cd799439013",
    userName: "LiteraryFan",
    rating: 4,
    title: "Great Character Development",
    content: "The characters are complex and well-developed. Gatsby himself is both admirable and tragic.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

console.log("Sample data prepared for seeding:")
console.log(`${sampleBooks.length} books`)
console.log(`${sampleReviews.length} reviews`)

// In a real implementation, you would insert this data into MongoDB:
// await db.collection('books').insertMany(sampleBooks);
// await db.collection('reviews').insertMany(sampleReviews);

# Book Review Platform

A full-stack book review platform built with Next.js, React, and MongoDB. Users can browse books, read and write reviews, and rate books.

## Features

### Frontend (React/Next.js)
- **Responsive UI** with modern design using Tailwind CSS and shadcn/ui
- **Home page** with featured books showcase
- **Book listing page** with search and filter functionality
- **Individual book pages** with detailed information and reviews
- **User profile page** with editable information
- **Review submission form** with rating system
- **State management** using React Context API
- **Client-side routing** with Next.js App Router
- **Error handling** and loading states throughout the application

### Backend (Node.js/Express via Next.js API Routes)
- **RESTful API** with the following endpoints:
  - `GET /api/books` - Retrieve all books (with pagination, search, and filtering)
  - `GET /api/books/[id]` - Retrieve a specific book
  - `POST /api/books` - Add a new book (admin functionality)
  - `GET /api/reviews` - Retrieve reviews for a book
  - `POST /api/reviews` - Submit a new review
  - `GET /api/users/[id]` - Retrieve user profile
  - `PUT /api/users/[id]` - Update user profile
- **Data validation** and comprehensive error handling
- **MongoDB integration** for data persistence
- **Pagination** support for large datasets

## Technology Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with native MongoDB driver
- **State Management**: React Context API with useReducer
- **Icons**: Lucide React
- **Image Handling**: Next.js Image component

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd book-review-platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` and add your MongoDB connection string:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/bookreviews
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

The application will automatically connect to MongoDB using the provided connection string. You can seed the database with sample data by running the seeding script (implementation would depend on your setup).

## API Documentation

### Books API

#### GET /api/books
Retrieve books with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of books per page (default: 12)
- `search` (string): Search term for title or author
- `genre` (string): Filter by genre
- `featured` (boolean): Filter featured books only

**Response:**
\`\`\`json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
\`\`\`

#### GET /api/books/[id]
Retrieve a specific book by ID.

#### POST /api/books
Create a new book (admin functionality).

### Reviews API

#### GET /api/reviews
Retrieve reviews for a specific book.

**Query Parameters:**
- `bookId` (string, required): Book ID to get reviews for
- `page` (number): Page number for pagination
- `limit` (number): Number of reviews per page

#### POST /api/reviews
Submit a new review.

**Request Body:**
\`\`\`json
{
  "bookId": "string",
  "userId": "string",
  "userName": "string",
  "rating": 1-5,
  "title": "string",
  "content": "string"
}
\`\`\`

### Users API

#### GET /api/users/[id]
Retrieve user profile information.

#### PUT /api/users/[id]
Update user profile information.

## Features in Detail

### Search and Filtering
- Real-time search across book titles and authors
- Genre-based filtering
- Responsive search interface

### Rating System
- 5-star rating system for reviews
- Average rating calculation and display
- Visual star representation

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Loading states for better UX

### State Management
- Centralized state using React Context
- Optimistic updates for better performance
- Proper state synchronization


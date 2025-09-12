# Next.js Blog App

A full-stack blog application built with [Next.js](https://nextjs.org), Prisma, and MongoDB.

##  Live Demo

Check out the deployed app:  
[full-stack-nextjs-1-blog-i868tqy0h.vercel.app](https://full-stack-nextjs-1-blog-i868tqy0h.vercel.app)

## Features

- User authentication (login required for creating, updating, or deleting posts)
- CRUD operations for blog posts
- Commenting system
- RESTful API routes
- Prisma ORM for database access
- Responsive UI

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Create a `.env` file based on `.env.example`
   - Configure your database connection string

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## API Usage Example

### Login

```bash
curl -X POST https://full-stack-nextjs-1-blog-i868tqy0h.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourpassword"}'
```

**Response:**
```json
{
  "token": "your-jwt-token"
}
```

### Get a Post

```bash
curl https://full-stack-nextjs-1-blog-i868tqy0h.vercel.app/api/posts/POST_ID
```

### Update a Post

```bash
curl -X PUT https://full-stack-nextjs-1-blog-i868tqy0h.vercel.app/api/posts/POST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Updated Title","content":"Updated content"}'
```

### Delete a Post

```bash
curl -X DELETE https://full-stack-nextjs-1-blog-i868tqy0h.vercel.app/api/posts/POST_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Folder Structure

- `src/app/api/posts/[id]/route.ts` – API routes for posts
- `src/app/login/page.tsx` – Login page
- `src/lib/prisma.ts` – Prisma client
- `prisma/schema.prisma` – Database schema

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)


//3_blog_app\src\app\posts\[id]\page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import "./postDetail.css"; // new CSS file

interface Post {
  id: string;
  title: string;
  content: string;
  author: { id: string; name: string };
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data: Post = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!post) return <p className="error-text">Post not found!</p>;

  return (
    <div className="post-detail-wrapper">
      <button className="back-btn" onClick={() => router.back()}>
        ← Back
      </button>

      <div className="post-detail-card">
        <h1 className="post-detail-title">{post.title}</h1>
        <p className="post-detail-author">By {post.author.name}</p>
        <div className="post-detail-content">{post.content}</div>
      </div>
    </div>
  );
}

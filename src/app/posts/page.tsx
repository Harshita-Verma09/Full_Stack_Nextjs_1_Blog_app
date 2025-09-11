// 3_blog_app/src/app/posts/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {jwtDecode} from "jwt-decode";
import "./posts.css";

interface User {
  id: string;
}

interface Post {
  id: string;
  title: string;
  content?: string;
  author: { id: string; name: string };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  //Get logged-in user from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        setUser(null);
      }
    }
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    if (!user) {
      alert("You must be logged in");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
        alert("Post deleted successfully");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete post");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="posts-wrapper">
      <div className="posts-header">
        <h1>📖 All Posts</h1>
        <Link href="/posts/new" className="new-post-btn">
          ➕ New Post
        </Link>
      </div>

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h2>
              <Link href={`/posts/${post.id}`} className="post-title">
                {post.title}
              </Link>
            </h2>
            <p className="post-content">{post.content?.slice(0, 150)}...</p>
            <div className="post-footer">
              <span className="post-author"> {post.author.name}</span>

              {/* Only show Edit/Delete if current user is the author */}
              {user?.id === post.author.id && (
                <div className="post-actions">
                  <Link href={`/posts/edit/${post.id}`} className="edit-btn">
                     Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={loading}
                    className="delete-btn"
                  >
                     Delete
                  </button>
                </div>
              )}

              <Link href={`/posts/${post.id}`} className="read-more">
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

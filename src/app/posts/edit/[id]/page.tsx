//3_blog_app\src\app\posts\edit\[id]\page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import "./editPost.css"; 

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${params.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((post) => {
        setTitle(post.title);
        setContent(post.content);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/posts/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      router.push("/posts");
    } else {
      alert("❌ Failed to update post");
    }
  };

  return (
    <div className="edit-wrapper">
      {/* Back Button */}
      <button
        className="back-btn"
        onClick={() => router.push("/posts")}
      >
        ← Back to Posts
      </button>

      <h1 className="edit-title">Edit Post</h1>
      <form onSubmit={handleSubmit} className="edit-form">
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="edit-input"
        />
        <textarea
          placeholder="Write your content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="edit-textarea"
        />
        <button type="submit" className="edit-btn">
          💾 Save Changes
        </button>
      </form>
    </div>
  );
}

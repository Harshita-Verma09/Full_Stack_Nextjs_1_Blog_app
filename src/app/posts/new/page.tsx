


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./newPost.css"; 

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      await res.json();
      router.push("/posts");
    } else {
      const data = await res.json();
      alert(data.error || "Error creating post");
    }

    setLoading(false);
  };

  return (
    <div className="new-wrapper">
      {/* Back Button */}
      <button className="back-btn" onClick={() => router.push("/posts")}>
        ← Back to Posts
      </button>

      <h1 className="new-title">Create New Post</h1>
      <form onSubmit={handleSubmit} className="new-form">
        <input
          type="text"
          placeholder="Enter post title..."
          className="new-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your amazing content here..."
          className="new-textarea"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" disabled={loading} className="new-btn">
          {loading ? "Saving..." : " Create Post"}
        </button>
      </form>
    </div>
  );
}

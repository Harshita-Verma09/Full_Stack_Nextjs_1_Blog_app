"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "./delete.css";

// 🔹 Define Post type
type Post = {
  id: string;
  title: string;
  content?: string;
};

export default function DeletePostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );

  // 🔹 Toast handler
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔹 Fetch single post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data: Post = await res.json();
        setPost(data);
      } catch (err) {
        showToast("Could not load post", "error");
      }
    };
    fetchPost();
  }, [params.id]);

  // 🔹 Delete post handler
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You must be logged in", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        showToast("Post deleted successfully", "success");
        setTimeout(() => router.push("/posts"), 1500);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete post", "error");
      }
    } catch {
      showToast("Network error. Try again.", "error");
    }

    setLoading(false);
  };

  if (!post) return <p className="loading-text">Loading...</p>;

  return (
    <div className="delete-wrapper">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <h1 className="delete-title">Delete Post</h1>
      <p className="delete-message">
        Are you sure you want to delete the post: <strong>{post.title}</strong>?
      </p>

      <div className="delete-actions">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="btn delete-btn"
        >
          {loading ? "Deleting..." : "🗑 Delete"}
        </button>
        <button onClick={() => router.back()} className="btn cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

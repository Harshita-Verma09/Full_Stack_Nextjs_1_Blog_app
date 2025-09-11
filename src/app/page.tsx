//3_blog_app\src\app\page.tsx
import Link from "next/link";
import "./page.css";

export default function HomePage() {
  return (
    <main className="home-container">
      <div className="hero-card">
        <h1 className="hero-title">Welcome to Blog App</h1>
        <p className="hero-subtitle">
          Share your thoughts, explore posts, and connect with the world 
        </p>

        <div className="buttons">
          <Link href="/login" className="btn btn-login">
            Login
          </Link>
          <Link href="/register" className="btn btn-register">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}

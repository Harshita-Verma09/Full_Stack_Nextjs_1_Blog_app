"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./register.css"; 

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Something went wrong");
      }

      const data = await res.json();
      alert(data.message || "Registered!");

      // 🔹 register ke baad login page par bhej do
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-container">
      <h1 className="register-title">Create an Account</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </main>
  );
}

"use client";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      await axios.post("api/users/forgotpassword", { email });
      toast.success("Reset link sent! Check your email 📧");
      setSent(true);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h2 className="text-2xl text-green-500">
          ✅ Password reset link has been sent to your email!
        </h2>
        <Link href="/login" className="text-blue-500 underline mt-4">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl mb-4">Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded text-black bg-white mb-4"
      />
      <button
        onClick={handleForgotPassword}
        disabled={!email || loading}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </div>
  );
}

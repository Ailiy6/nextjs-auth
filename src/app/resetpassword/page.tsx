"use client";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    setToken(urlToken || "");
  }, []);

  const handledResetPassword = async () => {
    try {
      await axios.post("/api/users/resetpassword", {
        token,
        newPassword,
      });
      toast.success("Password reset successfully");
      setSuccess(true);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h2 className="text-2xl text-green-500">✅ Password has been reset!</h2>
        <Link href="/login" className="text-blue-500 underline mt-4">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl">Reset Password</h1>
      <input
        type="password"
        className="p-2 m-2 border text-black bg-white rounded"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        onClick={handledResetPassword}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Reset Password
      </button>
    </div>
  );
}

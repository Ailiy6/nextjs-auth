import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ✅ Buat response kosong dulu
    const response = NextResponse.redirect(
      new URL(
        "/login",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      )
    );
    // ↑ kalau kau deploy dekat vercel, set NEXT_PUBLIC_APP_URL dalam .env = https://namaappkau.vercel.app

    // ✅ Clear both accessToken & refreshToken
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // expired segera
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // expired segera
    });

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

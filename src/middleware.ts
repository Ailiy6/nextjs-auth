import { NextResponse, NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes — tak perlu login
  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail" ||
    path === "/forgotpassword" ||
    path.startsWith("/resetpassword");

  // Ambil token dari cookies
  const accessToken = request.cookies.get("token")?.value || "";
  const refreshToken = request.cookies.get("refreshToken")?.value || "";
  // Helper untuk verify token
  const verifyToken = (token: string, secret: string) => {
    try {
      return jwt.verify(token, secret);
    } catch {
      return null;
    }
  };

  const decodedAccessToken = accessToken
    ? verifyToken(accessToken, process.env.TOKEN_SECRET!)
    : null;
  // Kalau user dah login dan cuba buka page public
  if (isPublicPath && decodedAccessToken) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  // Kalau user belum login dan cuba buka private route
  if (!isPublicPath && !decodedAccessToken) {
    const decodedRefresh = refreshToken
      ? verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
      : null;

    if (decodedRefresh && typeof decodedRefresh !== "string") {
      // ✅ Ensure it's a JwtPayload and has _id
      const userId = (decodedRefresh as JwtPayload)._id;
      // Kalau refresh token masih valid → buat access token baru
      if (userId) {
        const newAccessToken = jwt.sign(
          { _id: userId },
          process.env.TOKEN_SECRET!,
          { expiresIn: "15m" }
        );

        const response = NextResponse.next();
        response.cookies.set("token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 15, // 15 min
        });

        return response;
      }
    }
    // Kalau dua-dua token invalid → redirect ke login
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Kalau semua ok, proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/signup",
    "/verifyemail",
    "/forgotpassword",
    "/resetpassword/:path*",
    "/profile/:path*",
  ],
};

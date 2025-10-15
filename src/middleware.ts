import { NextResponse, NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes (tak perlu login)
  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail" ||
    path === "/forgotpassword" ||
    path.startsWith("/resetpassword");

  const accessToken = request.cookies.get("token")?.value || "";
  const refreshToken = request.cookies.get("refreshToken")?.value || "";

  const verifyToken = (token: string, secret: string) => {
    try {
      return jwt.verify(token, secret);
    } catch {
      return null;
    }
  };

  // Verify access token
  const decodedAccess = accessToken
    ? verifyToken(accessToken, process.env.TOKEN_SECRET!)
    : null;

  // 🧩 Case 1: User belum login dan nak masuk page private
  if (!isPublicPath && !decodedAccess && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🧩 Case 2: Access token dah expired → guna refresh token
  if (!isPublicPath && !decodedAccess && refreshToken) {
    const decodedRefresh = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );

    if (decodedRefresh && typeof decodedRefresh !== "string") {
      // Buat access token baru
      const newAccessToken = jwt.sign(
        {
          _id: (decodedRefresh as JwtPayload)._id,
          email: (decodedRefresh as JwtPayload).email,
          username: (decodedRefresh as JwtPayload).username,
        },
        process.env.TOKEN_SECRET!,
        { expiresIn: "15m" }
      );

      // Set cookie baru
      const response = NextResponse.next();
      response.cookies.set("token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15,
      });

      return response;
    }

    // Kalau refresh token invalid juga
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🧩 Case 3: User dah login tapi cuba masuk page login/signup
  if (isPublicPath && decodedAccess) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // ✅ Semua ok → proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/login",
    "/signup",
    "/verifyemail",
    "/forgotpassword",
    "/resetpassword/:path*",
  ],
};

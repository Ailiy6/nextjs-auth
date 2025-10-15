import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token found" },
        { status: 401 }
      );
    }

    // ✅ Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // ✅ Generate new access token
    const newAccessToken = jwt.sign(
      {
        _id: (decoded as jwt.JwtPayload)._id,
        email: (decoded as jwt.JwtPayload).email,
        username: (decoded as jwt.JwtPayload).username,
      },
      process.env.TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    // ✅ Set new access token as cookie
    const response = NextResponse.json({
      message: "Access token refreshed successfully",
      success: true,
    });

    response.cookies.set("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    return response;
  } catch (error: any) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

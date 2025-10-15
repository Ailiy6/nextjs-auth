import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel.js";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    // ✅ 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // ✅ 2. Check password
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // ✅ 3. Create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // ✅ 4. Create access + refresh tokens
    const accessToken = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      tokenData,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    // ✅ 5. Create response & set cookies
    const response = NextResponse.json({
      message: "Login successfully",
      success: true,
    });

    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 min
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // ✅ 6. Return response
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

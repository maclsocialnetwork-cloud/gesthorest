import { NextResponse } from "next/server";
import { APPRENANT_COOKIE } from "@/lib/apprenant-session";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(APPRENANT_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function signout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-token");
  cookieStore.delete("boot-id");

  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"));
}

export const POST = signout;
export const GET = signout;

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { isAdminEmail } from "@/lib/auth";
import { SERVER_BOOT_ID } from "@/lib/boot-id";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Not authorized as admin" }, { status: 403 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return NextResponse.json({ error: error?.message ?? "Invalid credentials" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin-token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  cookieStore.set("boot-id", SERVER_BOOT_ID, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

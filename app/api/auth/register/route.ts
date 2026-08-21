import { NextResponse } from "next/server";

import { createSession, hashPasscode, passcodeLookup, validatePasscode } from "@/lib/custom-auth";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  const { passcode } = await request.json().catch(() => ({}));
  if (!validatePasscode(passcode)) return NextResponse.json({ error: "Passcode must be exactly 6 digits." }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.from("app_users").insert({ passcode_hash: await hashPasscode(passcode), passcode_lookup: passcodeLookup(passcode) }).select("id").single();
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "That passcode is already in use. Choose another one." }, { status: 409 });
    return NextResponse.json({ error: "Unable to create your account." }, { status: 500 });
  }

  await createSession(data.id);
  return NextResponse.json({ userId: data.id }, { status: 201 });
}

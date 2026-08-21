import { NextResponse } from "next/server";

import { createAdminClient } from "@/utils/supabase/admin";
import { getCurrentUserId, hashPasscode, passcodeLookup, validatePasscode, verifyPasscode } from "@/lib/custom-auth";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { currentPasscode, newPasscode } = await request.json().catch(() => ({}));
  if (!validatePasscode(currentPasscode) || !validatePasscode(newPasscode)) return NextResponse.json({ error: "Passcodes must be exactly 6 digits." }, { status: 400 });
  if (currentPasscode === newPasscode) return NextResponse.json({ error: "Choose a different passcode." }, { status: 400 });

  const admin = createAdminClient();
  const { data: user } = await admin.from("app_users").select("passcode_hash").eq("id", userId).single();
  if (!user || !(await verifyPasscode(currentPasscode, user.passcode_hash))) return NextResponse.json({ error: "Current passcode is incorrect." }, { status: 400 });

  const { error } = await admin.from("app_users").update({ passcode_hash: await hashPasscode(newPasscode), passcode_lookup: passcodeLookup(newPasscode), updated_at: new Date().toISOString() }).eq("id", userId);
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "That passcode is already in use." }, { status: 409 });
    return NextResponse.json({ error: "Unable to change passcode." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

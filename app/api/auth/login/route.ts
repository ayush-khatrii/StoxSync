import { NextResponse } from "next/server";

import {
  createSession,
  passcodeLookup,
  validatePasscode,
  verifyPasscode,
} from "@/lib/custom-auth";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  const { passcode } = await request.json().catch(() => ({}));
  if (!validatePasscode(passcode))
    return NextResponse.json(
      { error: "Enter your 6-digit passcode." },
      { status: 400 },
    );

  const admin = createAdminClient();
  const { data } = await admin
    .from("app_users")
    .select("id, passcode_hash")
    .eq("passcode_lookup", passcodeLookup(passcode))
    .maybeSingle();
  if (!data || !(await verifyPasscode(passcode, data.passcode_hash)))
    return NextResponse.json({ error: "Invalid passcode." }, { status: 401 });

  await createSession(data.id);
  return NextResponse.json({ userId: data.id });
}

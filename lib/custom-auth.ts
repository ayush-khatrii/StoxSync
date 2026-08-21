import { cookies } from "next/headers";
import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

import { createAdminClient } from "@/utils/supabase/admin";

const scrypt = promisify(scryptCallback);
export const SESSION_COOKIE = "stoxsync_session";
const SESSION_DAYS = 30;

export function validatePasscode(passcode: unknown) {
  return typeof passcode === "string" && /^\d{6}$/.test(passcode);
}

export function passcodeLookup(passcode: string) {
  return createHash("sha256").update(passcode).digest("hex");
}

export async function hashPasscode(passcode: string) {
  const salt = randomBytes(16);
  const derived = (await scrypt(passcode, salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPasscode(passcode: string, storedHash: string) {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex) return false;
  const derived = (await scrypt(
    passcode,
    Buffer.from(saltHex, "hex"),
    64,
  )) as Buffer;
  const expected = Buffer.from(hashHex, "hex");
  return (
    expected.length === derived.length && timingSafeEqual(expected, derived)
  );
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
  const admin = createAdminClient();
  const { error } = await admin
    .from("app_sessions")
    .insert({ user_id: userId, token_hash: tokenHash, expires_at: expiresAt });
  if (error) throw error;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getCurrentUserId() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("app_sessions")
    .select("user_id, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();
  if (error || !data || new Date(data.expires_at) <= new Date()) return null;
  return data.user_id as string;
}

export async function clearCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    const admin = createAdminClient();
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await admin.from("app_sessions").delete().eq("token_hash", tokenHash);
  }
  cookieStore.delete(SESSION_COOKIE);
}

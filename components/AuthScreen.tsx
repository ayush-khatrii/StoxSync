"use client";

import { useState } from "react";
import { ArrowRight, Delete, LockKeyhole, ShieldCheck } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [passcode, setPasscode] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const activeValue = mode === "register" && confirm.length > 0 ? confirm : passcode;

  function appendDigit(digit: string) {
    setError("");
    if (mode === "register" && passcode.length === 6 && confirm.length < 6) setConfirm((value) => value + digit);
    else if (passcode.length < 6) setPasscode((value) => value + digit);
  }

  function backspace() {
    if (mode === "register" && confirm.length > 0) setConfirm((value) => value.slice(0, -1));
    else setPasscode((value) => value.slice(0, -1));
    setError("");
  }

  async function submit() {
    if (passcode.length !== 6 || (mode === "register" && confirm !== passcode)) {
      setError(mode === "register" ? "Enter the same six digits twice." : "Enter all six digits.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (mode === "register") await register(passcode);
      else await login(passcode);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to continue.");
      setPasscode("");
      setConfirm("");
    } finally {
      setBusy(false);
    }
  }

  function switchMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setPasscode("");
    setConfirm("");
    setError("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-sm border border-border/70 bg-card p-6 shadow-2xl shadow-black/20 sm:p-8">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><LockKeyhole className="size-5" /></div>
        <p className="mt-8 text-sm font-medium text-primary">Private workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{mode === "login" ? "Unlock Stoxsync" : "Create your passcode"}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Your six-digit passcode keeps your IPO applications linked to you.</p>

        <div className="mt-8 flex justify-center gap-3" aria-label="Passcode progress">
          {Array.from({ length: 6 }, (_, index) => <span key={index} className={cn("size-3 rounded-full border border-muted-foreground/40 transition", activeValue.length > index && "border-primary bg-primary")} />)}
        </div>
        {mode === "register" && <p className="mt-3 text-center text-xs text-muted-foreground">{confirm.length ? "Confirm your passcode" : "Choose a six-digit passcode"}</p>}

        {error && <p className="mt-5 border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p>}

        <div className="mx-auto mt-7 grid max-w-[260px] grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => <Button key={digit} type="button" variant="outline" className="size-14 rounded-full text-lg" onClick={() => appendDigit(digit)}>{digit}</Button>)}
          <span />
          <Button type="button" variant="outline" className="size-14 rounded-full text-lg" onClick={() => appendDigit("0")}>0</Button>
          <Button type="button" variant="ghost" size="icon" className="size-14 rounded-full" onClick={backspace} aria-label="Delete last digit"><Delete className="size-5" /></Button>
        </div>

        <Button type="button" className="mt-8 h-11 w-full" disabled={busy} onClick={() => void submit()}>{busy ? "Checking…" : mode === "login" ? "Enter workspace" : "Create workspace"}<ArrowRight className="size-4" /></Button>

        <button type="button" className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-muted-foreground transition hover:text-foreground" onClick={() => switchMode(mode === "login" ? "register" : "login")}><ShieldCheck className="size-4" />{mode === "login" ? "Create a new workspace" : "I already have a passcode"}</button>
      </section>
    </main>
  );
}

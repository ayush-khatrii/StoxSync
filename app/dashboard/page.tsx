"use client";

import { useState } from "react";
import { Check, KeyRound, LogOut } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
  const { changePasscode, logout } = useAuth();
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (newPasscode !== confirmPasscode) { setError("New passcodes do not match."); return; }
    setBusy(true);
    try {
      await changePasscode(currentPasscode, newPasscode);
      setMessage("Passcode changed successfully.");
      setCurrentPasscode("");
      setNewPasscode("");
      setConfirmPasscode("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to change passcode.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <div className="border-b border-border/70 pb-8"><p className="text-sm font-medium text-primary">Account</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Workspace settings</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Change the six-digit passcode used to unlock this private IPO tracker.</p></div>
        <section className="mt-10 max-w-xl border border-border/70 bg-card p-5 sm:p-7">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><KeyRound className="size-5" /></span><div><h2 className="font-semibold">Change passcode</h2><p className="text-sm text-muted-foreground">Use numbers only. Six digits required.</p></div></div>
          <form className="mt-7 space-y-5" onSubmit={(event) => void submit(event)}>
            <PasscodeField id="current-passcode" label="Current passcode" value={currentPasscode} onChange={setCurrentPasscode} />
            <PasscodeField id="new-passcode" label="New passcode" value={newPasscode} onChange={setNewPasscode} />
            <PasscodeField id="confirm-passcode" label="Confirm new passcode" value={confirmPasscode} onChange={setConfirmPasscode} />
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            {message && <p className="flex items-center gap-2 text-sm text-primary"><Check className="size-4" />{message}</p>}
            <Button type="submit" className="h-10 w-full sm:w-auto" disabled={busy}>{busy ? "Saving…" : "Change passcode"}</Button>
          </form>
        </section>
        <div className="mt-10 border-t border-border/70 pt-6"><Button variant="outline" onClick={() => void logout()}><LogOut className="size-4" />Lock workspace</Button></div>
      </div>
    </main>
  );
}

function PasscodeField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type="password" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" value={value} onChange={(event) => onChange(event.target.value.replace(/\\D/g, "").slice(0, 6))} className="h-11 tracking-[0.35em]" required /></div>;
}

"use client";

import { useState } from "react";
import { useStoredList } from "@/components/use-stored-list";
import { IpoList } from "@/components/IpoList";
import { IpoSheet } from "@/components/IpoSheet";
import { Navbar } from "@/components/Navbar";
import type { Ipo } from "@/constants";

export default function AllIposPage() {
  const [ipos, setIpos] = useStoredList<Ipo>("stoxsync-ipos", []);
  const [editingIpo, setEditingIpo] = useState<Ipo | null>(null);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-7 border-b border-border/70 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-medium text-primary">All IPOs</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Your IPO list</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Add the essential details you have available. This list does not depend on an API response.</p></div>
          <IpoSheet editingIpo={editingIpo} onEditClose={() => setEditingIpo(null)} onAdd={(ipo) => setIpos((current) => [ipo, ...current])} onUpdate={(ipo) => setIpos((current) => current.map((item) => item.id === ipo.id ? ipo : item))} />
        </div>
        <section className="mt-14"><div className="mb-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-lg font-semibold">{ipos.length} IPO{ipos.length === 1 ? "" : "s"} tracked</h2><span className="text-sm text-muted-foreground">Company, date, price, lot, and issue size</span></div><IpoList ipos={ipos} onEdit={setEditingIpo} onDelete={(ipo) => setIpos((current) => current.filter((item) => item.id !== ipo.id))} /></section>
      </div>
    </main>
  );
}

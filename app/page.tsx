"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, TrendingUp, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";

import { ApplicationSheet, type ApplicationEntry } from "@/components/ApplicationSheet";
import { ApplicationList, formatCurrency } from "@/components/ApplicationList";
import { IpoList } from "@/components/IpoList";
import { Navbar } from "@/components/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { PANS, type Ipo } from "@/constants";
import { useStoredList } from "@/components/use-stored-list";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [applications, setApplications] = useStoredList<ApplicationEntry>("stoxsync-applications", []);
  const [editingApplication, setEditingApplication] = useState<ApplicationEntry | null>(null);
  const [ipos] = useStoredList<Ipo>("stoxsync-ipos", []);
  const totalBlocked = useMemo(() => applications.reduce((total, application) => total + application.total, 0), [applications]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary">IPO application tracker</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Know what is blocked, what is open, and what comes next.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">A focused workspace for tracking applications, bid amounts, important dates, and the IPO pipeline.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ApplicationSheet editingApplication={editingApplication} onEditClose={() => setEditingApplication(null)} onAdd={(application) => setApplications((current) => [application, ...current])} onUpdate={(application) => setApplications((current) => current.map((item) => item.id === application.id ? application : item))} />
              <Link href="/all-ipos" className={cn(buttonVariants({ variant: "outline" }))}>Browse all IPOs<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard label="Blocked amount" value={formatCurrency(totalBlocked)} helper="Across tracked applications" icon={WalletCards} primary />
            <StatCard label="Applications" value={String(applications.length).padStart(2, "0")} helper="Entries being monitored" icon={CheckCircle2} />
            <StatCard label="Tracked IPOs" value={String(ipos.length).padStart(2, "0")} helper="Manually added issues" icon={TrendingUp} />
          </div>
        </section>

        <section className="mt-14 border-y border-border/70 py-6"><div className="grid gap-6 sm:grid-cols-3"><Metric label="Tracked accounts" value={`${PANS.length} PANs`} /><Metric label="IPO pipeline" value={`${ipos.length} issues`} /><Metric label="Application total" value={formatCurrency(totalBlocked)} /></div></section>

        <section className="mt-16"><SectionHeader eyebrow="Applied" title="Recent applications" href="/applied" action="View all" /><div className="mt-8"><ApplicationList applications={applications.slice(0, 3)} onEdit={setEditingApplication} onDelete={(application) => setApplications((current) => current.filter((item) => item.id !== application.id))} /></div></section>
        <section className="mt-16 pb-8"><SectionHeader eyebrow="All IPOs" title="The current pipeline" href="/all-ipos" action="View all" /><div className="mt-8"><IpoList ipos={ipos.slice(0, 4)} /></div></section>
      </div>
    </main>
  );
}

function StatCard({ label, value, helper, icon: Icon, primary }: { label: string; value: string; helper: string; icon: typeof WalletCards; primary?: boolean }) {
  return <div className={cn("border border-border/70 bg-card p-5 sm:p-6", primary && "bg-primary text-primary-foreground")}><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className={cn("text-sm", primary ? "text-primary-foreground/75" : "text-muted-foreground")}>{label}</p><p className="mt-3 truncate text-2xl font-semibold">{value}</p></div><Icon className={cn("size-5 shrink-0", primary ? "text-primary-foreground" : "text-primary")} aria-hidden="true" /></div><p className={cn("mt-5 text-sm", primary ? "text-primary-foreground/75" : "text-muted-foreground")}>{helper}</p></div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div>; }

function SectionHeader({ eyebrow, title, href, action }: { eyebrow: string; title: string; href: string; action: string }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-primary">{eyebrow}</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2></div><Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground">{action}<ArrowUpRight className="size-4" aria-hidden="true" /></Link></div>;
}

"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ApplicationSheet, type ApplicationEntry } from "@/components/ApplicationSheet";
import { ApplicationList, formatCurrency } from "@/components/ApplicationList";
import { Navbar } from "@/components/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApplications } from "@/components/use-applications";
import { ApplicationSummarySkeleton, ApplicationTableSkeleton } from "@/components/DataSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppliedPage() {
  const { applications, addApplication, updateApplication, deleteApplication, loading, error } = useApplications();
  const [editingApplication, setEditingApplication] = useState<ApplicationEntry | null>(null);
  const grandTotal = useMemo(() => applications.reduce((total, application) => total + application.total, 0), [applications]);

  return (
    <main className="min-h-screen my-10 bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-7 border-b border-border/70 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Applied</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Application tracker</h1>
            <p className="mt-2 text-sm text-muted-foreground">Monitor every bid and the amount currently blocked.</p>
          </div>
        </div>
        {loading ? <ApplicationSummarySkeleton /> : <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Summary label="Total blocked" value={formatCurrency(grandTotal)} primary />
          <Summary label="Total applications" value={String(applications.length).padStart(2, "0")} />
          <Summary label="Tracked lots" value={String(applications.reduce((sum, application) => sum + application.lots, 0)).padStart(2, "0")} />
        </div>
        }
        <div className="flex justify-end my-5">
          <ApplicationSheet editingApplication={editingApplication} onEditClose={() => setEditingApplication(null)} onAdd={addApplication} onUpdate={updateApplication} />
        </div>
        <section className="mt-16">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">All applications</h2>
            {loading ? <Skeleton className="h-4 w-36" /> : <span className="text-sm text-muted-foreground">Grand total <strong className="text-foreground">{formatCurrency(grandTotal)}</strong></span>}
          </div>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
          {loading ? <ApplicationTableSkeleton /> : <ApplicationList applications={applications} onEdit={setEditingApplication} onDelete={deleteApplication} />}
        </section>
        <div className="mt-16 border-t border-border/70 pt-6 text-sm text-muted-foreground"><Link href="/all-ipos" className={cn(buttonVariants({ variant: "link", size: "sm" }), "px-0")}>Review IPO pipeline <ArrowUpRight className="size-4" aria-hidden="true" /></Link></div>
      </div>
    </main>
  );
}

function Summary({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return <div className={cn("border border-border/5 bg-card text-foreground  p-5 sm:p-6", primary && "bg-transparent border-primary/60 text-foreground")}><p className={cn("text-sm", primary ? "text-foreground/75" : "text-muted-background")}>{label}</p><p className="mt-3 text-2xl font-semibold">{value}</p></div>;
}

"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export function DatePicker({ value, onChange, placeholder = "Select date" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseDate(value) : undefined;

  return (
    <div className="relative">
      <Button type="button" variant="outline" className="h-10 w-full justify-between px-3 font-normal" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span className={cn(!value && "text-muted-foreground")}>{value ? formatDate(value) : placeholder}</span>
        <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
      </Button>
      {open && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 z-[60] rounded-lg border border-border bg-popover text-popover-foreground shadow-xl">
          <Calendar mode="single" selected={selected} onSelect={(date) => { if (date) { onChange(toInputDate(date)); setOpen(false); } }} />
        </div>
      )}
    </div>
  );
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(parseDate(value));
}

export function formatDateRange(start: string, end: string) {
  if (!start || !end) return "";
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function parseDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function toInputDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

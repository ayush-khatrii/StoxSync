"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function IpoPagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-1" aria-label="IPO pagination">
      <Button type="button" variant="outline" size="sm" disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="size-3.5" />Prev
      </Button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <Button
          key={pageNumber}
          type="button"
          variant={pageNumber === page ? "default" : "ghost"}
          size="icon-sm"
          aria-label={`Page ${pageNumber}`}
          aria-current={pageNumber === page ? "page" : undefined}
          onClick={() => onChange(pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}
      <Button type="button" variant="outline" size="sm" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Next<ChevronRight className="size-3.5" />
      </Button>
    </nav>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { IPO_CATEGORIES, IPO_CATEGORY_LABELS, type IpoCategory } from "@/lib/market-ipos";

export function IpoCategoryTabs({ activeCategory, onChange }: { activeCategory: IpoCategory; onChange: (category: IpoCategory) => void }) {
  return (
    <div className="max-w-full overflow-x-auto pb-1" role="tablist" aria-label="IPO categories">
      <div className="flex min-w-max items-center gap-1 border-b border-border/70">
        {IPO_CATEGORIES.map((category) => (
          <Button
            key={category}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            variant="ghost"
            className={activeCategory === category ? "rounded-none border-b-2 border-primary text-primary" : "rounded-none text-muted-foreground"}
            onClick={() => onChange(category)}
          >
            {IPO_CATEGORY_LABELS[category]}
          </Button>
        ))}
      </div>
    </div>
  );
}

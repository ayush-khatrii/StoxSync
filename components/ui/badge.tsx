import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 border px-2 py-0.5 text-[10px] font-medium leading-4",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground",
        accent: "border-primary/30 bg-primary/10 text-primary",
        secondary: "border-border bg-muted text-muted-foreground",
        outline: "border-border bg-transparent text-foreground",
        success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

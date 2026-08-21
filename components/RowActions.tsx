"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type MenuPosition = { top: number; right: number };

export function RowActions({ itemLabel, onEdit, onDelete }: { itemLabel: string; onEdit: () => void; onDelete: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ top: 0, right: 12 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !menuRef.current?.contains(target)) setMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function toggleMenu() {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const menuHeight = 76;
    setPosition({
      top: rect.bottom + menuHeight > window.innerHeight ? Math.max(12, rect.top - menuHeight - 4) : rect.bottom + 4,
      right: Math.max(12, window.innerWidth - rect.right),
    });
    setMenuOpen(true);
  }

  const menu = menuOpen && typeof document !== "undefined" ? createPortal(
    <div ref={menuRef} className="fixed z-[100] w-32 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-xl" style={{ top: position.top, right: position.right }}>
      <button type="button" className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-xs hover:bg-accent hover:text-accent-foreground" onClick={() => { setMenuOpen(false); onEdit(); }}><Pencil className="size-3.5" aria-hidden="true" />Edit</button>
      <button type="button" className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-xs text-destructive hover:bg-destructive/10" onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}><Trash2 className="size-3.5" aria-hidden="true" />Delete</button>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button ref={buttonRef} type="button" className={buttonVariants({ variant: "ghost", size: "icon-sm" })} aria-label={`Actions for ${itemLabel}`} aria-expanded={menuOpen} onClick={toggleMenu}>
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </button>
      {menu}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Delete {itemLabel}?</DialogTitle><DialogDescription>This removes the saved record from your tracker. This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><DialogClose render={<Button variant="outline" />}>Cancel</DialogClose><Button variant="destructive" onClick={() => { setConfirmOpen(false); onDelete(); }}><Trash2 className="size-4" aria-hidden="true" />Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

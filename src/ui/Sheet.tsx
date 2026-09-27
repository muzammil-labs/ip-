import * as Dialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { LAYER } from "./layers";
import { useT } from "../i18n/useT";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}

/**
 * Radix Dialog: a right drawer on desktop, a bottom sheet on mobile (90dvh, drag handle).
 * Focus is trapped by Radix, Escape closes, focus returns to the trigger automatically.
 */
export default function Sheet({ open, onOpenChange, title, children }: SheetProps) {
  const t = useT();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-ink/30 backdrop-blur-[2px]"
          style={{ zIndex: LAYER.sheet }}
        />
        <Dialog.Content
          className="fixed inset-x-0 bottom-0 flex max-h-[90dvh] flex-col rounded-t-container bg-surface-2 shadow-2 focus:outline-none sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:max-h-none sm:w-full sm:max-w-[440px] sm:rounded-t-none sm:rounded-l-container"
          style={{ zIndex: LAYER.sheet }}
        >
          <div className="flex justify-center pt-2 sm:hidden" aria-hidden="true">
            <div className="h-1 w-10 rounded-pill bg-line-strong" />
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <Dialog.Title className="text-h3 text-ink">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("closeAria")}
                className="flex h-9 w-9 items-center justify-center rounded-control text-ink-2 hover:bg-wash"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

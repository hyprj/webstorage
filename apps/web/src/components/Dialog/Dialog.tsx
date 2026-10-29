import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";

export type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Dialog({
  open,
  title,
  description,
  onClose,
  children,
  footer,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-[min(30rem,calc(100%-2rem))] overflow-visible rounded-panel border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-overlay/40 backdrop:backdrop-blur-sm"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="border-b border-border px-6 pb-4 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 id={titleId} className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm leading-5 text-muted">
                {description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 min-h-8 px-0"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <Icon name="x" className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div className="space-y-5 px-6 py-5">{children}</div>
      {footer && (
        <div className="flex justify-end gap-2 border-t border-border bg-surface-subtle px-6 py-4">
          {footer}
        </div>
      )}
    </dialog>
  );
}

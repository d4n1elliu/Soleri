interface ConfirmDialogProps {
  title: string;
  body: string;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-zinc-800 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-label={title}
      >
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-2 text-sm text-zinc-400">{body}</p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40"
          >
            {busy ? `${confirmLabel}…` : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-zinc-600 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

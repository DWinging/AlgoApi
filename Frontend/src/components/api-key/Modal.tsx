import { type PropsWithChildren, useEffect } from "react";

type ModalProps = PropsWithChildren<{
  title: string;
  onClose: () => void;
}>;

function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4">
      <section
        className="relative w-full max-w-[520px] rounded-lg border border-border bg-surface p-6 text-foreground shadow-xl max-sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-key-modal-title"
      >
        <h2 id="api-key-modal-title" className="pr-10 text-xl font-bold tracking-[-0.02em]">
          {title}
        </h2>
        <button
          className="absolute top-4 right-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          type="button"
          onClick={onClose}
          aria-label="모달 닫기"
        >
          <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="m3 3 10 10M13 3 3 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {children}
      </section>
    </div>
  );
}

export default Modal;

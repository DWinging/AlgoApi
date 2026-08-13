import Modal from "./Modal";

type RegenerateConfirmModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

function RegenerateConfirmModal({
  onCancel,
  onConfirm,
  isSubmitting,
}: RegenerateConfirmModalProps) {
  return (
    <Modal title="API Key 재발급" onClose={onCancel}>
      <p className="mt-3 text-sm leading-6 text-muted">
        재발급하면 기존 API Key는 즉시 사용할 수 없게 됩니다. 계속하시겠습니까?
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          className="h-10 cursor-pointer rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          className="h-10 cursor-pointer rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:border-primary-hover hover:bg-primary-hover disabled:cursor-not-allowed disabled:border-border disabled:bg-muted/20 disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Regenerating..." : "Regenerate"}
        </button>
      </div>
    </Modal>
  );
}

export default RegenerateConfirmModal;

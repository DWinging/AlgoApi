import { useState } from "react";
import Modal from "./Modal";

type ApiKeyResultModalProps = {
  apiKey: string;
  onClose: () => void;
};

function ApiKeyResultModal({ apiKey, onClose }: ApiKeyResultModalProps) {
  const [copied, setCopied] = useState(false);

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal title="API Key 발급" onClose={onClose}>
      <p className="mt-2.5 text-sm leading-6 text-muted">새로운 API Key가 발급되었습니다.</p>
      <div className="mt-4 flex items-center gap-3 rounded-md border border-border bg-background p-3 max-sm:flex-col max-sm:items-stretch">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground">
          {apiKey}
        </code>
        <button
          className="h-9 shrink-0 cursor-pointer rounded-md border border-border bg-surface px-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          type="button"
          onClick={copyApiKey}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-3.5 text-sm leading-6 text-muted">
        이 API Key는 지금 한 번만 확인할 수 있습니다.
        <br />
        안전한 곳에 보관해주세요.
      </p>
      <p className="sr-only" aria-live="polite">
        {copied ? "API Key가 클립보드에 복사되었습니다." : ""}
      </p>
    </Modal>
  );
}

export default ApiKeyResultModal;

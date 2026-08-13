import type { ApiKeyInfo } from "./types";

type CurrentApiKeySectionProps = {
  apiKey: ApiKeyInfo | null;
  onGenerate: () => void;
  onRegenerate: () => void;
};

const primaryButtonClass =
  "h-11 cursor-pointer rounded-md border border-primary bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:border-primary-hover hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function CurrentApiKeySection({ apiKey, onGenerate, onRegenerate }: CurrentApiKeySectionProps) {
  return (
    <section className="mt-10 border-t border-border pt-8" aria-labelledby="current-key-title">
      <h2 id="current-key-title" className="text-xl font-bold tracking-[-0.02em] text-foreground">
        Current API Key
      </h2>

      {!apiKey ? (
        <div className="mt-4">
          <p className="text-sm leading-6 text-muted">아직 발급된 API Key가 없습니다.</p>
          <button className={`${primaryButtonClass} mt-6`} type="button" onClick={onGenerate}>
            Generate API Key
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">API Key</p>
            <code className="mt-2 block overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground">
              {apiKey.maskedKey}
            </code>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Status</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                Active
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Issued At</p>
              <p className="mt-2 text-sm font-medium text-foreground">{apiKey.issuedAt}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Expires At</p>
              <p className="mt-2 text-sm font-medium text-foreground">{apiKey.expiresAt}</p>
            </div>
          </div>

          <button className={`${primaryButtonClass} mt-8`} type="button" onClick={onRegenerate}>
            Regenerate API Key
          </button>
        </div>
      )}
    </section>
  );
}

export default CurrentApiKeySection;

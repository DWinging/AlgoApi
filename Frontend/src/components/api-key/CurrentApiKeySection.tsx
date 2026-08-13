import type { ApiKeyInfo } from "./types";

type CurrentApiKeySectionProps = {
  apiKey: ApiKeyInfo | null;
  onGenerate: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  isInitialLoading: boolean;
};

const primaryButtonClass =
  "h-11 cursor-pointer rounded-md border border-primary bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:border-primary-hover hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const compactPrimaryButtonClass =
  "inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-border bg-surface px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const metadataItemClass = "grid min-w-0 grid-rows-[1rem_2.25rem] gap-2";
const metadataValueClass = "flex h-9 min-w-0 items-center text-sm font-medium text-foreground";

function CurrentApiKeySection({
  apiKey,
  onGenerate,
  onRegenerate,
  isLoading,
  isInitialLoading,
}: CurrentApiKeySectionProps) {
  return (
    <section className="mt-10 border-t border-border pt-8" aria-labelledby="current-key-title">
      <h2 id="current-key-title" className="text-xl font-bold tracking-[-0.02em] text-foreground">
        Current API Key
      </h2>

      {isInitialLoading ? (
        <p className="mt-4 text-sm leading-6 text-muted">API Key 정보를 불러오는 중입니다.</p>
      ) : !apiKey ? (
        <div className="mt-4">
          <p className="text-sm leading-6 text-muted">아직 발급된 API Key가 없습니다.</p>
          <button
            className={`${primaryButtonClass} mt-6 disabled:cursor-not-allowed disabled:border-border disabled:bg-muted/20 disabled:text-muted`}
            type="button"
            onClick={onGenerate}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate API Key"}
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid max-w-[620px] grid-cols-4 gap-4">
            <div className={metadataItemClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Status</p>
              <p className={`${metadataValueClass} gap-2`}>
                <span
                  className={`size-2 rounded-full ${apiKey.status === "active" ? "bg-primary" : "bg-muted"}`}
                  aria-hidden="true"
                />
                {apiKey.status === "active" ? "Active" : "Inactive"}
              </p>
            </div>
            {apiKey.issuedAt && (
              <div className={metadataItemClass}>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                  Issued At
                </p>
                <p className={metadataValueClass}>{apiKey.issuedAt}</p>
              </div>
            )}
            {apiKey.expiresAt && (
              <div className={metadataItemClass}>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                  Expires At
                </p>
                <p className={metadataValueClass}>{apiKey.expiresAt}</p>
              </div>
            )}
            {apiKey.status === "active" && (
              <div className={metadataItemClass}>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                  Action
                </p>
                <div className={metadataValueClass}>
                  <button
                    className={`${compactPrimaryButtonClass} disabled:cursor-not-allowed disabled:bg-muted/20 disabled:text-muted`}
                    type="button"
                    onClick={onRegenerate}
                    disabled={isLoading}
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default CurrentApiKeySection;

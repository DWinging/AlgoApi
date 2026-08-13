import { useState } from "react";
import ApiKeyResultModal from "../components/api-key/ApiKeyResultModal";
import ApiUsageSection from "../components/api-key/ApiUsageSection";
import CurrentApiKeySection from "../components/api-key/CurrentApiKeySection";
import RegenerateConfirmModal from "../components/api-key/RegenerateConfirmModal";
import type { ApiKeyInfo } from "../components/api-key/types";

function ApiKeyPage() {
  // Populate these states from the API Key lookup and issue API responses.
  const [apiKeyInfo] = useState<ApiKeyInfo | null>(null);
  const [plainApiKey, setPlainApiKey] = useState<string | null>(null);
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);

  const issueApiKey = () => {
    // Connect the issue/regenerate API here.
    setIsRegenerateOpen(false);
  };

  const closeResultModal = () => {
    // Discard the one-time plaintext value when the modal closes.
    setPlainApiKey(null);
  };

  return (
    <>
      <article className="mx-auto w-full max-w-[720px]">
        <header>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-foreground">API Key</h1>
          <p className="mt-2 max-w-[620px] text-sm leading-6 text-muted">
            외부 클라이언트에서 AlgoAPI를 호출할 때 사용하는 API Key를 발급하고 관리할 수
            있습니다.
          </p>
        </header>

        <CurrentApiKeySection
          apiKey={apiKeyInfo}
          onGenerate={issueApiKey}
          onRegenerate={() => setIsRegenerateOpen(true)}
        />
        <ApiUsageSection />
      </article>

      {isRegenerateOpen && (
        <RegenerateConfirmModal
          onCancel={() => setIsRegenerateOpen(false)}
          onConfirm={issueApiKey}
        />
      )}
      {plainApiKey && <ApiKeyResultModal apiKey={plainApiKey} onClose={closeResultModal} />}
    </>
  );
}

export default ApiKeyPage;

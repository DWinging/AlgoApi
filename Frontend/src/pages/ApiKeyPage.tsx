import { useCallback, useEffect, useState } from "react";
import {
  getApiKeyStatus,
  getApiKeyErrorMessage,
  issueApiKey as requestApiKeyIssue,
  reissueApiKey as requestApiKeyReissue,
} from "../api/apiKeyApi";
import ApiKeyResultModal from "../components/api-key/ApiKeyResultModal";
import ApiUsageSection from "../components/api-key/ApiUsageSection";
import CurrentApiKeySection from "../components/api-key/CurrentApiKeySection";
import RegenerateConfirmModal from "../components/api-key/RegenerateConfirmModal";
import type { ApiKeyInfo } from "../components/api-key/types";

function ApiKeyPage() {
  const [apiKeyInfo, setApiKeyInfo] = useState<ApiKeyInfo | null>(null);
  const [plainApiKey, setPlainApiKey] = useState<string | null>(null);
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"issue" | "reissue" | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatDate = (date: string | null) =>
    date
      ? new Intl.DateTimeFormat("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(date))
      : undefined;

  const loadApiKeyStatus = useCallback(async () => {
    const status = await getApiKeyStatus();

    if (!status.issued) {
      setApiKeyInfo(null);
      return;
    }

    setApiKeyInfo({
      status: status.active ? "active" : "inactive",
      issuedAt: formatDate(status.issuedAt),
      expiresAt: formatDate(status.expiresAt),
    });
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadInitialStatus = async () => {
      try {
        await loadApiKeyStatus();
      } catch (error) {
        if (isActive) {
          setErrorMessage(
            getApiKeyErrorMessage(
              error,
              "API Key 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
            ),
          );
        }
      } finally {
        if (isActive) {
          setIsInitialLoading(false);
        }
      }
    };

    void loadInitialStatus();
    return () => {
      isActive = false;
    };
  }, [loadApiKeyStatus]);

  const applyIssuedApiKey = async (apiKey: string) => {
    setApiKeyInfo({ status: "active" });
    setPlainApiKey(apiKey);

    try {
      await loadApiKeyStatus();
    } catch (error) {
      setErrorMessage(
        getApiKeyErrorMessage(error, "발급된 API Key 상태를 불러오지 못했습니다."),
      );
    }
  };

  const issueApiKey = async () => {
    if (pendingAction) {
      return;
    }

    setErrorMessage(null);
    setPendingAction("issue");

    try {
      await applyIssuedApiKey(await requestApiKeyIssue());
    } catch (error) {
      setErrorMessage(
        getApiKeyErrorMessage(error, "API Key 발급에 실패했습니다. 잠시 후 다시 시도해주세요."),
      );
    } finally {
      setPendingAction(null);
    }
  };

  const reissueApiKey = async () => {
    if (pendingAction) {
      return;
    }

    setErrorMessage(null);
    setPendingAction("reissue");

    try {
      await applyIssuedApiKey(await requestApiKeyReissue());
      setIsRegenerateOpen(false);
    } catch (error) {
      setErrorMessage(
        getApiKeyErrorMessage(error, "API Key 재발급에 실패했습니다. 잠시 후 다시 시도해주세요."),
      );
    } finally {
      setPendingAction(null);
    }
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
          isLoading={pendingAction !== null}
          isInitialLoading={isInitialLoading}
        />
        {errorMessage && (
          <p
            className="mt-5 rounded-md border border-danger-border bg-danger-surface px-3 py-2.5 text-sm text-danger"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
        <ApiUsageSection />
      </article>

      {isRegenerateOpen && (
        <RegenerateConfirmModal
          onCancel={() => setIsRegenerateOpen(false)}
          onConfirm={reissueApiKey}
          isSubmitting={pendingAction === "reissue"}
        />
      )}
      {plainApiKey && <ApiKeyResultModal apiKey={plainApiKey} onClose={closeResultModal} />}
    </>
  );
}

export default ApiKeyPage;

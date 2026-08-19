import { useCallback, useEffect, useRef, useState } from "react";
import { getDailyProblem, getProblemErrorMessage } from "../api/problemApi";
import { useAuth } from "../auth/auth-context";

const LEGACY_DAILY_PROBLEM_STORAGE_KEY = "algoapi.localHistory";
const DAILY_PROBLEM_STORAGE_KEY_PREFIX = "algoapi.localHistory";
const SEOUL_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

type DailyProblemCache = {
  userId: number;
  date: string;
  url: string;
  problemId: number;
};

function getToday() {
  const dateParts = SEOUL_DATE_FORMATTER.formatToParts(new Date());
  const year = dateParts.find(({ type }) => type === "year")?.value;
  const month = dateParts.find(({ type }) => type === "month")?.value;
  const day = dateParts.find(({ type }) => type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function getDailyProblemStorageKey(userId: number) {
  return `${DAILY_PROBLEM_STORAGE_KEY_PREFIX}.${userId}`;
}

function readCachedProblem(userId: number | null) {
  if (!userId) {
    return null;
  }

  try {
    const storageKey = getDailyProblemStorageKey(userId);
    const storedValue = localStorage.getItem(storageKey);

    if (!storedValue) {
      return null;
    }

    const cache = JSON.parse(storedValue) as Partial<DailyProblemCache>;

    if (
      cache.userId === userId &&
      cache.date === getToday() &&
      cache.url &&
      typeof cache.problemId === "number"
    ) {
      return cache as DailyProblemCache;
    }

    localStorage.removeItem(storageKey);
    return null;
  } catch {
    localStorage.removeItem(getDailyProblemStorageKey(userId));
    return null;
  }
}

function openInNewTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function useDailyProblem() {
  const { userId } = useAuth();
  const [dailyProblem, setDailyProblem] = useState<DailyProblemCache | null>(() =>
    readCachedProblem(userId),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pendingRef = useRef(false);

  useEffect(() => {
    localStorage.removeItem(LEGACY_DAILY_PROBLEM_STORAGE_KEY);
  }, []);

  useEffect(() => {
    setDailyProblem(readCachedProblem(userId));
    setErrorMessage(null);
  }, [userId]);

  const openDailyProblem = useCallback(async () => {
    if (!userId) {
      return;
    }

    const cachedProblem = readCachedProblem(userId) ?? dailyProblem;

    if (cachedProblem?.userId === userId && cachedProblem.date === getToday()) {
      openInNewTab(cachedProblem.url);
      return;
    }

    if (pendingRef.current) {
      return;
    }

    pendingRef.current = true;
    setIsLoading(true);
    setErrorMessage(null);
    const problemWindow = window.open("about:blank", "_blank");

    if (problemWindow) {
      problemWindow.opener = null;
    }

    try {
      const problem = await getDailyProblem();
      const cache: DailyProblemCache = {
        userId,
        date: getToday(),
        url: problem.url,
        problemId: problem.id,
      };

      localStorage.setItem(getDailyProblemStorageKey(userId), JSON.stringify(cache));
      setDailyProblem(cache);

      if (problemWindow) {
        problemWindow.location.replace(problem.url);
      } else {
        openInNewTab(problem.url);
      }
    } catch (error) {
      problemWindow?.close();
      setErrorMessage(
        getProblemErrorMessage(
          error,
          "오늘의 문제를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        ),
      );
    } finally {
      pendingRef.current = false;
      setIsLoading(false);
    }
  }, [dailyProblem, userId]);

  return {
    dailyProblemUrl: dailyProblem?.url ?? null,
    isLoading,
    errorMessage,
    openDailyProblem,
  };
}

import { useCallback, useRef, useState } from "react";

const DAILY_PROBLEM_STORAGE_KEY = "algoapi.dailyProblemUrl";

type DailyProblemCache = {
  date: string;
  url: string;
};

export type DailyProblemFetcher = () => Promise<string>;

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readCachedUrl() {
  try {
    const storedValue = sessionStorage.getItem(DAILY_PROBLEM_STORAGE_KEY);
    if (!storedValue) return null;

    const cache = JSON.parse(storedValue) as Partial<DailyProblemCache>;
    return cache.date === getToday() && cache.url ? cache.url : null;
  } catch {
    return null;
  }
}

function openInNewTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function useDailyProblem(fetchDailyProblem?: DailyProblemFetcher) {
  const [dailyProblemUrl, setDailyProblemUrl] = useState<string | null>(readCachedUrl);
  const [isLoading, setIsLoading] = useState(false);
  const pendingRef = useRef(false);

  const openDailyProblem = useCallback(async () => {
    if (dailyProblemUrl) {
      openInNewTab(dailyProblemUrl);
      return;
    }

    if (!fetchDailyProblem || pendingRef.current) return;

    pendingRef.current = true;
    setIsLoading(true);

    try {
      const url = await fetchDailyProblem();
      const cache: DailyProblemCache = { date: getToday(), url };
      sessionStorage.setItem(DAILY_PROBLEM_STORAGE_KEY, JSON.stringify(cache));
      setDailyProblemUrl(url);
      openInNewTab(url);
    } finally {
      pendingRef.current = false;
      setIsLoading(false);
    }
  }, [dailyProblemUrl, fetchDailyProblem]);

  return { dailyProblemUrl, isLoading, openDailyProblem };
}

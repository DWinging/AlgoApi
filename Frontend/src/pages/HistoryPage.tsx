import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  getProblemErrorMessage,
  getProblemHistory,
  type ProblemHistoryResponse,
} from "../api/problemApi";
import { useDailyProblem } from "../daily-problem/useDailyProblem";

type HistoryItem = {
  id: number;
  date: string;
  platform: string;
  problem: string;
  level: string;
  algorithms: string[];
  url: string;
};

const badgeClass =
  "inline-flex h-6 items-center rounded-full border border-border bg-background px-2 text-xs font-medium whitespace-nowrap text-muted";
const historyGridStyle: CSSProperties = {
  gridTemplateColumns:
    "clamp(82px, 14%, 100px) clamp(88px, 15%, 108px) minmax(0, 1fr) clamp(56px, 10%, 72px) clamp(58px, 9%, 68px)",
};

type AlgorithmBadgesProps = {
  algorithms: string[];
  expanded: boolean;
  onToggle: () => void;
};

function AlgorithmBadges({ algorithms, expanded, onToggle }: AlgorithmBadgesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const overflowBadgeRef = useRef<HTMLSpanElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  const calculateVisibleCount = useCallback(() => {
    const availableWidth = containerRef.current?.clientWidth ?? 0;
    const badgeWidths = badgeRefs.current.map(
      (badge) => badge?.getBoundingClientRect().width ?? 0,
    );

    if (!availableWidth || badgeWidths.some((width) => width === 0)) return;

    const gap = 4;
    const totalWidth = badgeWidths.reduce((sum, width) => sum + width, 0);
    const totalGaps = Math.max(0, algorithms.length - 1) * gap;

    if (totalWidth + totalGaps <= availableWidth) {
      setVisibleCount(algorithms.length);
      return;
    }

    const overflowWidth = overflowBadgeRef.current?.getBoundingClientRect().width ?? 0;
    let usedWidth = overflowWidth;
    let nextVisibleCount = 0;

    for (const badgeWidth of badgeWidths) {
      const candidateWidth = usedWidth + gap + badgeWidth;
      if (candidateWidth > availableWidth) break;
      usedWidth = candidateWidth;
      nextVisibleCount += 1;
    }

    setVisibleCount(nextVisibleCount);
  }, [algorithms]);

  useLayoutEffect(() => {
    calculateVisibleCount();

    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(calculateVisibleCount);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [calculateVisibleCount]);

  const hiddenCount = algorithms.length - visibleCount;

  return (
    <div className="relative mt-1.5 min-w-0">
      <div
        className={expanded ? "flex flex-wrap items-center gap-1" : "flex items-center gap-1 overflow-hidden"}
        ref={containerRef}
      >
        {(expanded ? algorithms : algorithms.slice(0, visibleCount)).map((algorithm) => (
          <span className={`${badgeClass} max-w-full truncate`} key={algorithm} title={algorithm}>
            {algorithm}
          </span>
        ))}

        {!expanded && hiddenCount > 0 && (
          <button
            className={`${badgeClass} shrink-0 cursor-pointer transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary`}
            type="button"
            onClick={onToggle}
            aria-expanded="false"
            aria-label={`숨겨진 알고리즘 ${hiddenCount}개 보기`}
          >
            +{hiddenCount}
          </button>
        )}

        {expanded && (
          <button
            className={`${badgeClass} ml-auto shrink-0 cursor-pointer transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary`}
            type="button"
            onClick={onToggle}
            aria-expanded="true"
            aria-label="알고리즘 목록 접기"
          >
            ▲
          </button>
        )}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <div className="flex w-max items-center gap-1">
          {algorithms.map((algorithm, index) => (
            <span
              className={badgeClass}
              key={algorithm}
              ref={(element) => {
                badgeRefs.current[index] = element;
              }}
            >
              {algorithm}
            </span>
          ))}
          <span className={badgeClass} ref={overflowBadgeRef}>
            +{algorithms.length}
          </span>
        </div>
      </div>
    </div>
  );
}

function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(() => new Set());
  const {
    dailyProblemUrl,
    isLoading: isDailyProblemLoading,
    errorMessage: dailyProblemError,
    openDailyProblem,
  } = useDailyProblem();

  const mapHistoryItem = (item: ProblemHistoryResponse): HistoryItem => ({
    id: item.id,
    date: item.allocatedDate,
    platform: item.platform,
    problem: item.title,
    level: item.level,
    algorithms: item.algorithms,
    url: item.url,
  });

  useEffect(() => {
    let isActive = true;

    const loadHistory = async () => {
      setIsHistoryLoading(true);
      setHistoryError(null);

      try {
        const history = await getProblemHistory();

        if (isActive) {
          setHistoryItems(history.map(mapHistoryItem));
        }
      } catch (error) {
        if (isActive) {
          setHistoryError(
            getProblemErrorMessage(
              error,
              "문제 기록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
            ),
          );
        }
      } finally {
        if (isActive) {
          setIsHistoryLoading(false);
        }
      }
    };

    void loadHistory();
    return () => {
      isActive = false;
    };
  }, [dailyProblemUrl]);

  const toggleRow = (id: number) => {
    setExpandedRows((currentRows) => {
      const nextRows = new Set(currentRows);
      if (nextRows.has(id)) nextRows.delete(id);
      else nextRows.add(id);
      return nextRows;
    });
  };

  return (
    <article className="mx-auto w-full max-w-[720px]">
      <header
        className="w-full gap-8"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-foreground">History</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            문제 기록을 확인할 수 있습니다.
          </p>
        </div>
        <button
          className="ml-auto inline-flex h-9 shrink-0 items-center rounded-md border border-border bg-surface px-3 text-sm font-semibold text-muted transition-colors enabled:cursor-pointer enabled:hover:border-primary enabled:hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          type="button"
          onClick={openDailyProblem}
          disabled={isDailyProblemLoading}
        >
          {isDailyProblemLoading ? "불러오는 중..." : "오늘의 문제"}
        </button>
      </header>

      {dailyProblemError && (
        <p
          className="mt-5 rounded-md border border-danger-border bg-danger-surface px-3 py-2.5 text-sm text-danger"
          role="alert"
        >
          {dailyProblemError}
        </p>
      )}

      <section className="mt-10 border-t border-border pt-8" aria-label="문제 기록">
        {isHistoryLoading ? (
          <p className="py-12 text-center text-sm text-muted">문제 기록을 불러오는 중입니다.</p>
        ) : historyError ? (
          <p
            className="rounded-md border border-danger-border bg-danger-surface px-3 py-2.5 text-sm text-danger"
            role="alert"
          >
            {historyError}
          </p>
        ) : historyItems.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">아직 문제 기록이 없습니다.</p>
        ) : (
          <div className="w-full min-w-0 text-left text-sm" role="table">
            <div role="rowgroup">
              <div
                className="grid min-w-0 border-b border-border text-xs font-semibold uppercase tracking-[0.05em] text-muted"
                role="row"
                style={historyGridStyle}
              >
                <div className="min-w-0 py-3 pr-2" role="columnheader">Date</div>
                <div className="min-w-0 px-2 py-3" role="columnheader">Platform</div>
                <div className="min-w-0 px-2 py-3" role="columnheader">Problem</div>
                <div className="min-w-0 px-2 py-3" role="columnheader">Level</div>
                <div className="min-w-0 py-3 pl-2" role="columnheader">Action</div>
              </div>
            </div>

            <div role="rowgroup">
              {historyItems.map((item) => {
                const isExpanded = expandedRows.has(item.id);

                return (
                  <div
                    className="grid min-h-[76px] min-w-0 items-center border-b border-border text-foreground"
                    key={item.id}
                    role="row"
                    style={historyGridStyle}
                  >
                    <div className="min-w-0 truncate py-3 pr-2 text-muted" role="cell" title={item.date}>
                      {item.date}
                    </div>
                    <div className="min-w-0 truncate px-2 py-3 font-medium" role="cell" title={item.platform}>
                      {item.platform}
                    </div>
                    <div className="min-w-0 overflow-hidden px-2 py-3" role="cell">
                      <p className="w-full min-w-0 truncate font-medium" title={item.problem}>
                        {item.problem}
                      </p>
                      <AlgorithmBadges
                        algorithms={item.algorithms}
                        expanded={isExpanded}
                        onToggle={() => toggleRow(item.id)}
                      />
                    </div>
                    <div className="min-w-0 truncate px-2 py-3 text-muted" role="cell" title={item.level}>
                      {item.level}
                    </div>
                    <div className="min-w-0 py-3 pl-2" role="cell">
                      <a
                        className="font-semibold whitespace-nowrap text-primary transition-colors hover:text-primary-hover hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${item.problem} 문제 새 탭에서 열기`}
                      >
                        Open →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </article>
  );
}

export default HistoryPage;

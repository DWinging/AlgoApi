import { Link } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import { useDailyProblem } from "../daily-problem/useDailyProblem";

const STEPS = [
  {
    number: "01",
    title: "문제 받기",
    description: "하루에 한 번 새로운 문제를 받아볼 수 있습니다.",
  },
  {
    number: "02",
    title: "기록 확인",
    description: "지금까지 받은 문제 기록을 확인할 수 있습니다.",
    to: "/history",
  },
  {
    number: "03",
    title: "API 사용",
    description: "발급받은 API Key로 외부에서도 문제를 조회할 수 있습니다.",
    to: "/api-key",
  },
] as const;

function MainPage() {
  const { isAuthenticated } = useAuth();
  const {
    isLoading: isDailyProblemLoading,
    errorMessage: dailyProblemError,
    openDailyProblem: openDailyProblemUrl,
  } = useDailyProblem();

  const openDailyProblem = () => {
    void openDailyProblemUrl();
  };

  return (
    <article className="mx-auto w-full max-w-[720px]">
      <section className="py-4" aria-labelledby="main-title">
        <p className="text-sm font-semibold tracking-[0.08em] text-primary">AlgoAPI</p>
        <h1
          id="main-title"
          className="mt-4 w-full text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-[2.5rem] sm:leading-[1.2] md:whitespace-nowrap"
        >
          하루 한 문제. 쌓이는 알고리즘 기록.
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-7 text-muted sm:text-base">
          하루에 한 번, 여러 플랫폼의 문제 중 하나를 랜덤으로 받아볼 수 있습니다.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                className="h-11 cursor-pointer rounded-md border border-primary bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:border-primary-hover hover:bg-primary-hover disabled:cursor-not-allowed disabled:border-border disabled:bg-muted/20 disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                type="button"
                onClick={openDailyProblem}
                disabled={isDailyProblemLoading}
              >
                {isDailyProblemLoading ? "불러오는 중..." : "오늘의 문제"}
              </button>
              <Link
                className="inline-flex h-11 items-center rounded-md border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                to="/api-key"
              >
                API Key
              </Link>
              <Link
                className="inline-flex h-11 items-center rounded-md border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                to="/history"
              >
                History
              </Link>
            </>
          ) : (
            <>
              <Link
                className="inline-flex h-11 items-center rounded-md border border-primary bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:border-primary-hover hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                to="/login"
                state={{ from: "/" }}
              >
                Login
              </Link>
              <Link
                className="inline-flex h-11 items-center rounded-md border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        {dailyProblemError && isAuthenticated && (
          <p
            className="mt-4 rounded-md border border-danger-border bg-danger-surface px-3 py-2.5 text-sm text-danger"
            role="alert"
          >
            {dailyProblemError}
          </p>
        )}
      </section>

      <section className="mt-12 border-t border-border pt-10" aria-labelledby="how-it-works-title">
        <h2 id="how-it-works-title" className="text-xl font-bold tracking-[-0.02em] text-foreground">
          How it works
        </h2>

        <ol className="mt-7 grid gap-7 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((step) => (
            <li className="border-t border-border pt-4" key={step.number}>
              <span className="font-mono text-xs font-semibold text-primary">{step.number}</span>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {"to" in step ? (
                  <Link
                    className="underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    to={step.to}
                  >
                    {step.title}
                  </Link>
                ) : (
                  step.title
                )}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}

export default MainPage;

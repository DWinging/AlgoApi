import { Link, useNavigate } from "react-router-dom";

type ErrorPageProps = {
  status: 403 | 404 | 500;
};

const ERROR_CONTENT = {
  403: {
    title: "접근 권한이 없습니다",
    message: "이 페이지에 접근할 권한이 없습니다.",
  },
  404: {
    title: "페이지를 찾을 수 없습니다",
    message: "요청하신 주소가 변경되었거나 존재하지 않습니다.",
  },
  500: {
    title: "서버 오류가 발생했습니다",
    message: "잠시 후 다시 시도해주세요.",
  },
} as const;

export default function ErrorPage({ status }: ErrorPageProps) {
  const navigate = useNavigate();
  const content = ERROR_CONTENT[status];

  return (
    <section className="mx-auto flex min-h-[calc(100svh-276px)] w-full max-w-[560px] items-center justify-center py-8 text-center max-sm:min-h-[calc(100svh-234px)]">
      <div
        className={
          status === 404
            ? "w-full px-6 py-12 sm:px-10"
            : "w-full rounded-lg border border-border bg-surface px-6 py-12 sm:px-10"
        }
      >
        <p className="font-mono text-sm font-bold tracking-[0.12em] text-primary">{status}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-foreground">
          {content.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">{content.message}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {status !== 500 && (
            <button
              className="inline-flex h-10 cursor-pointer items-center rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              type="button"
              onClick={() => navigate(-1)}
            >
              이전 페이지
            </button>
          )}
          <Link
            className="inline-flex h-10 items-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:border-primary-hover hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            to="/"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </section>
  );
}

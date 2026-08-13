const curlExample = `curl -X GET \\
  -H "X-API-Key: your-api-key" \\
  https://your-domain.com/api/v1/problems/daily`;

const responseExample = `{
  "id": 12,
  "platform": "LeetCode",
  "number": 2708,
  "title": "Maximum Strength of a Group",
  "level": "Medium",
  "url": "https://leetcode.com/problems/maximum-strength-of-a-group",
  "algorithms": [
    "Greedy"
  ],
  "createdAt": "2026-08-13T08:00:00"
}`;

const codeBlockClass =
  "mt-3 overflow-x-auto rounded-md border border-border bg-surface p-4 font-mono text-sm leading-6 text-foreground";

function ApiUsageSection() {
  return (
    <section className="mt-12 border-t border-border pt-10" aria-labelledby="api-usage-title">
      <h2 id="api-usage-title" className="text-xl font-bold tracking-[-0.02em] text-foreground">
        API Usage
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        API Key를 요청 Header에 포함하여 일일 추천 문제를 조회할 수 있습니다.
      </p>

      <div className="mt-8 space-y-8">
        <section aria-labelledby="request-title">
          <h3 id="request-title" className="text-sm font-semibold text-foreground">
            Request
          </h3>
          <div className="mt-3 flex items-center gap-3 overflow-x-auto rounded-md border border-border bg-surface px-4 py-3 font-mono text-sm whitespace-nowrap">
            <span className="font-bold text-primary">GET</span>
            <code className="text-foreground">/api/v1/problems/daily</code>
          </div>
        </section>

        <section aria-labelledby="authentication-title">
          <h3 id="authentication-title" className="text-sm font-semibold text-foreground">
            Authentication
          </h3>
          <div className={codeBlockClass}>
            <code>X-API-Key: your-api-key</code>
          </div>
        </section>

        <section aria-labelledby="request-example-title">
          <h3 id="request-example-title" className="text-sm font-semibold text-foreground">
            Request Example
          </h3>
          <pre className={codeBlockClass}>
            <code>{curlExample}</code>
          </pre>
        </section>

        <section aria-labelledby="response-example-title">
          <h3 id="response-example-title" className="text-sm font-semibold text-foreground">
            Response
          </h3>
          <pre className={codeBlockClass}>
            <code>{responseExample}</code>
          </pre>
        </section>
      </div>
    </section>
  );
}

export default ApiUsageSection;

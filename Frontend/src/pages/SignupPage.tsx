import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";

const EMAIL_DOMAINS = ["gmail.com", "naver.com", "daum.net", "kakao.com"] as const;
const CUSTOM_DOMAIN_VALUE = "custom";

function SignupPage() {
  const [emailLocal, setEmailLocal] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>(EMAIL_DOMAINS[0]);
  const [customDomain, setCustomDomain] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCustomDomain = selectedDomain === CUSTOM_DOMAIN_VALUE;
  const emailDomain = isCustomDomain ? customDomain.trim() : selectedDomain;
  const email = emailLocal.trim() && emailDomain ? `${emailLocal.trim()}@${emailDomain}` : "";
  const isPasswordLengthValid = password.length >= 8 && password.length <= 32;
  const passwordError =
    passwordTouched && !isPasswordLengthValid ? "8~32자로 입력해주세요." : null;
  const confirmPasswordError = !confirmPassword
    ? confirmPasswordTouched
      ? "비밀번호 확인을 입력해주세요."
      : null
    : password !== confirmPassword
      ? "비밀번호가 일치하지 않습니다."
      : null;
  const canSubmit = Boolean(
    email && isPasswordLengthValid && confirmPassword && password === confirmPassword,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (!email) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    setErrorMessage(null);

    if (!canSubmit) {
      return;
    }

    // The sign-up API can be called here with this validated payload.
    const payload = { email, password };
    void payload;
  };

  return (
    <section className="mx-auto flex min-h-[calc(100svh-276px)] w-full max-w-[400px] items-center py-4 max-sm:min-h-[calc(100svh-234px)]">
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-foreground">Sign Up</h1>
          <p className="mt-1.5 text-sm leading-6 text-muted">Create your AlgoAPI account</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground" htmlFor="email-local">
              Email
            </label>
            <div className="flex h-11 items-center overflow-hidden rounded-md border border-border bg-surface transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
              <input
                className="h-full w-[42%] shrink-0 border-0 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted/70"
                id="email-local"
                name="emailLocal"
                type="text"
                value={emailLocal}
                onChange={(event) => {
                  setEmailLocal(event.target.value);
                  setErrorMessage(null);
                }}
                placeholder="user123"
                autoComplete="email"
                aria-label="이메일 아이디"
                required
              />
              <span className="shrink-0 px-1 text-sm font-medium text-muted" aria-hidden="true">
                @
              </span>
              {isCustomDomain ? (
                <div className="relative h-full min-w-0 flex-1">
                  <input
                    className="h-full w-full min-w-0 border-0 bg-transparent px-2 pr-9 text-sm text-foreground outline-none placeholder:text-muted/70"
                    id="email-domain"
                    name="customDomain"
                    type="text"
                    value={customDomain}
                    onChange={(event) => {
                      setCustomDomain(event.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="domain.com"
                    autoComplete="off"
                    aria-label="이메일 도메인 직접 입력"
                    required
                  />
                  <select
                    className="email-domain-select email-domain-switch absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent text-sm text-transparent outline-none"
                    value={selectedDomain}
                    onChange={(event) => {
                      setSelectedDomain(event.target.value);
                      setErrorMessage(null);
                    }}
                    aria-label="이메일 도메인 선택"
                  >
                    {EMAIL_DOMAINS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                    <option value={CUSTOM_DOMAIN_VALUE}>직접 입력</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-muted"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="m2.5 4.5 3.5 3 3.5-3"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : (
                <div className="relative h-full min-w-0 flex-1">
                  <select
                    className="email-domain-select h-full w-full cursor-pointer appearance-none border-0 bg-transparent px-2 pr-9 text-sm text-foreground outline-none"
                    id="email-domain"
                    name="selectedDomain"
                    value={selectedDomain}
                    onChange={(event) => {
                      setSelectedDomain(event.target.value);
                      setErrorMessage(null);
                    }}
                    aria-label="이메일 도메인"
                  >
                    {EMAIL_DOMAINS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                    <option value={CUSTOM_DOMAIN_VALUE}>직접 입력</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-muted"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="m2.5 4.5 3.5 3 3.5-3"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            <input type="hidden" name="email" value={email} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground" htmlFor="signup-password">
              Password
            </label>
            <input
              className="h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
              id="signup-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => setPasswordTouched(true)}
              placeholder="8~32자로 입력해주세요."
              autoComplete="new-password"
              minLength={8}
              maxLength={32}
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? "password-help" : undefined}
              required
            />
            {passwordError && (
              <p id="password-help" className="text-xs font-medium text-danger">
                8~32자로 입력해주세요.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-foreground"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              className="h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
              id="confirm-password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onBlur={() => setConfirmPasswordTouched(true)}
              placeholder="Confirm your password"
              autoComplete="new-password"
              minLength={8}
              maxLength={32}
              aria-invalid={Boolean(confirmPasswordError)}
              aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
              required
            />
            {confirmPasswordError && (
              <p id="confirm-password-error" className="text-xs font-medium text-danger">
                {confirmPasswordError}
              </p>
            )}
          </div>

          <div aria-live="polite">
            {errorMessage && (
              <p className="rounded-md border border-danger-border bg-danger-surface px-3 py-2.5 text-sm text-danger">
                {errorMessage}
              </p>
            )}
          </div>

          <button
            className="h-11 w-full rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-on-primary transition-colors enabled:cursor-pointer enabled:hover:border-primary-hover enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:border-border disabled:bg-muted/20 disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            type="submit"
            disabled={!canSubmit}
          >
            Sign Up
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default SignupPage;

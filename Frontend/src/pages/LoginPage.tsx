import { type FormEvent, type KeyboardEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLoginErrorMessage } from "../api/authApi";
import { useAuth } from "../auth/auth-context";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = Boolean(email.trim() && password);
  const isEmailFormatValid = /^[^\s@]+@[^\s@]+$/.test(email.trim());
  const emailError =
    emailTouched && email.trim() && !isEmailFormatValid
      ? "올바른 이메일 주소를 입력해주세요."
      : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      return;
    }

    setEmailTouched(true);

    if (!isEmailFormatValid) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (
      event.key !== "Enter" ||
      event.nativeEvent.isComposing ||
      event.target instanceof HTMLButtonElement
    ) {
      return;
    }

    event.preventDefault();
    event.currentTarget.requestSubmit();
  };

  return (
    <section className="mx-auto flex min-h-[calc(100svh-276px)] w-full max-w-[400px] items-center py-4 max-sm:min-h-[calc(100svh-234px)]">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-foreground">Login</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Sign in to your AlgoAPI account</p>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
          onKeyDown={handleFormKeyDown}
          noValidate
        >
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground" htmlFor="email">
              Email
            </label>
            <input
              className="h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrorMessage(null);
              }}
              onBlur={() => setEmailTouched(true)}
              placeholder="your@email.com"
              autoComplete="email"
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "login-email-error" : undefined}
              required
            />
            {emailError && (
              <p id="login-email-error" className="text-xs font-medium text-danger">
                {emailError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground" htmlFor="password">
              Password
            </label>
            <input
              className="h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrorMessage(null);
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
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
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            to="/signup"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;

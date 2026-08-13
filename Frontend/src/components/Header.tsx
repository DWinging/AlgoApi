import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import { useTheme } from "../theme/theme-context";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "header__link header__link--active" : "header__link";

  return (
    <header className="header">
      <div className="header__inner">
        <Link className="header__logo" to="/" aria-label="AlgoAPI 홈으로 이동">
          Algo<span>API</span>
        </Link>

        <nav className="header__nav" aria-label="주요 메뉴">
          <NavLink className={getNavLinkClass} to="/api-key">
            API Key
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink className={getNavLinkClass} to="/history">
                History
              </NavLink>
              <button className="header__link header__button" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className={getNavLinkClass} to="/login">
                Login
              </NavLink>
              <NavLink className={getNavLinkClass} to="/signup">
                Sign Up
              </NavLink>
            </>
          )}
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
            title={theme === "light" ? "다크 모드" : "라이트 모드"}
          >
            {theme === "light" ? (
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M20.4 15.4A8.5 8.5 0 0 1 8.6 3.6 8.5 8.5 0 1 0 20.4 15.4Z" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

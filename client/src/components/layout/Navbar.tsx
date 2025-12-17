import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Navbar() {
  const { isAuthed, signOut } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // 페이지 이동 시 모바일 메뉴 자동 닫기
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur"
      style={{
        backgroundColor: "rgba(255,255,255,0.6)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--walnut)",
          }}
        >
          Booksy
        </Link>

        {/* DESKTOP NAV (md 이상에서만 보임) */}
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link
            to="/books"
            className="transition-colors"
            style={{ color: "var(--ink)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--honey)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
          >
            Browse
          </Link>

          {!isAuthed ? (
            <Link
              to="/signin"
              className="rounded-xl px-4 py-2 font-semibold transition"
              style={{
                border: "1px solid var(--border)",
                color: "var(--walnut)",
                backgroundColor: "rgba(255,255,255,0.6)",
              }}
            >
              Sign in
            </Link>
          ) : (
            <>
              <Link
                to="/shelf"
                className="rounded-xl px-4 py-2 font-semibold transition"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--walnut)",
                  backgroundColor: "rgba(255,255,255,0.6)",
                }}
              >
                My shelf
              </Link>
              <button
                onClick={() => {
                  signOut();
                  nav("/");
                }}
                className="rounded-xl px-4 py-2 font-semibold transition"
                style={{ color: "var(--honey)" }}
              >
                Sign out
              </button>
            </>
          )}

          <Link
            to="/list"
            className="rounded-xl px-4 py-2 font-semibold text-white transition hover:opacity-95"
            style={{ backgroundColor: "var(--walnut)" }}
          >
            List a Book
          </Link>
        </nav>

        {/* MOBILE: 햄버거 버튼만 보임 (md 미만) */}
        <button
          className="inline-flex items-center justify-center rounded-xl border p-2 md:hidden"
          style={{ borderColor: "var(--card)", color: "var(--walnut)" }}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {open ? (
              <>
                <path d="M18 6 6 18" />
                <path d="M6 6 18 18" />
              </>
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE DROPDOWN (md 미만) */}
      <div className={`md:hidden ${open ? "block" : "hidden"}`}>
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <div
            className="rounded-2xl border p-2 shadow-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.9)" }}
          >
            <Link
              to="/books"
              className="block rounded-xl px-4 py-3 text-sm font-semibold"
              style={{ color: "var(--ink)" }}
              onClick={() => setOpen(false)}
            >
              Browse
            </Link>

            {!isAuthed ? (
              <Link
                to="/signin"
                className="block rounded-xl px-4 py-3 text-sm font-semibold"
                style={{ color: "var(--walnut)" }}
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            ) : (
              <>
                <Link
                  to="/shelf"
                  className="block rounded-xl px-4 py-3 text-sm font-semibold"
                  style={{ color: "var(--walnut)" }}
                  onClick={() => setOpen(false)}
                >
                  My shelf
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                    nav("/");
                  }}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: "var(--honey)" }}
                >
                  Sign out
                </button>
              </>
            )}

            <Link
              to="/list"
              className="mt-1 block rounded-xl px-4 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--walnut)" }}
              onClick={() => setOpen(false)}
            >
              List a Book
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { cartCount, CART_EVENT } from "../../lib/cart";

export default function Navbar() {
  const { isAuthed, signOut } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // ✅ cart badge count
  const [count, setCount] = useState<number>(() => (isAuthed ? cartCount() : 0));

  // 페이지 이동 시 모바일 메뉴 자동 닫기
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // ✅ cart count sync (same tab + other tabs)
  useEffect(() => {
    if (!isAuthed) {
      setCount(0);
      return;
    }

    const sync = () => setCount(cartCount());

    // same-tab custom event
    window.addEventListener(CART_EVENT, sync);
    // other-tab localStorage event
    window.addEventListener("storage", sync);

    // 초기 동기화
    sync();

    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [isAuthed]);

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

        {/* DESKTOP NAV */}
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

          {/* ✅ Cart: only when authed */}
          {isAuthed ? (
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center rounded-xl border p-2 transition hover:opacity-95"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "rgba(255,255,255,0.6)",
                color: "var(--walnut)",
              }}
              aria-label="Cart"
              title="Cart"
            >
              {/* icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>

              {/* badge */}
              {count > 0 ? (
                <span
                  className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: "var(--walnut)" }}
                >
                  {count}
                </span>
              ) : null}
            </Link>
          ) : null}

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

        {/* MOBILE: 햄버거 */}
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

      {/* MOBILE DROPDOWN */}
      <div className={`md:hidden ${open ? "block" : "hidden"}`}>
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <div
            className="rounded-2xl border p-2 shadow-sm"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
          >
            <Link
              to="/books"
              className="block rounded-xl px-4 py-3 text-sm font-semibold"
              style={{ color: "var(--ink)" }}
              onClick={() => setOpen(false)}
            >
              Browse
            </Link>

            {/* ✅ Mobile Cart: only when authed */}
            {isAuthed ? (
              <Link
                to="/cart"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold"
                style={{ color: "var(--walnut)" }}
                onClick={() => setOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <span>Cart</span>
                </span>

                {count > 0 ? (
                  <span
                    className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: "var(--walnut)" }}
                  >
                    {count}
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: "rgba(31,41,55,0.65)" }}>
                    0
                  </span>
                )}
              </Link>
            ) : null}

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

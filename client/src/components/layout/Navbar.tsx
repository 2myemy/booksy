import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Navbar() {
  const { isAuthed, signOut } = useAuth();
  const nav = useNavigate();

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

        {/* NAV */}
        <nav className="flex items-center gap-4 text-sm">
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
            to="/sell"
            className="rounded-xl px-4 py-2 font-semibold text-white transition hover:opacity-95"
            style={{ backgroundColor: "var(--walnut)" }}
          >
            List a Book
          </Link>
        </nav>
      </div>
    </header>
  );
}

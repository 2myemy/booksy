import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-3xl p-8 shadow-lg"
        style={{
          backgroundColor: "rgba(255,255,255,0.7)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="mb-6 block text-center text-2xl font-semibold"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--walnut)",
          }}
        >
          Booksy
        </Link>

        {children}
      </div>
    </div>
  );
}

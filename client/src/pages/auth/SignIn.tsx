import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function SignIn() {
  return (
    <AuthLayout>
      <h1 className="text-xl font-semibold text-slate-900">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Sign in to continue where your books left off.
      </p>

      <form className="mt-6 space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2"
          style={{ borderColor: "var(--border)" }}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2"
          style={{ borderColor: "var(--border)" }}
        />

        <button
          type="submit"
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-95"
          style={{ backgroundColor: "var(--walnut)" }}
        >
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        New here?{" "}
        <Link to="/signup" style={{ color: "var(--honey)" }}>
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

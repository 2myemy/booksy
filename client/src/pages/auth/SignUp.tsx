import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function SignUp() {
  return (
    <AuthLayout>
      <h1 className="text-xl font-semibold text-slate-900">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        List your books and pass them on to someone new.
      </p>

      <form className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
        />

        <button
          type="submit"
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-95"
          style={{ backgroundColor: "var(--walnut)" }}
        >
          Sign up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/signin" style={{ color: "var(--honey)" }}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

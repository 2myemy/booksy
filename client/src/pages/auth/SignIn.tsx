import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { apiPost, type AuthData } from "../../lib/auth";
import { useAuth } from "../../auth/AuthContext";

export default function SignIn() {
  const nav = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const from = (location.state as any)?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const data = await apiPost<AuthData>("/auth/login", { email, password });
      signIn(data.token);
      nav(from, { replace: true });
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-xl font-semibold text-slate-900">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-600">Sign in to continue.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
          required
        />

        {err && (
          <div
            className="rounded-xl border p-3 text-sm"
            style={{
              borderColor: "rgba(220,38,38,0.25)",
              backgroundColor: "rgba(220,38,38,0.06)",
            }}
          >
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
          style={{ backgroundColor: "var(--walnut)" }}
        >
          {loading ? "Signing in..." : "Sign in"}
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

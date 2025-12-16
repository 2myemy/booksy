import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { registerAuth } from "../../lib/auth"; 
import { useAuth } from "../../auth/AuthContext";

export default function SignUp() {
  const nav = useNavigate();
  const { signIn } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const data = await registerAuth({ name, email, password });
      signIn(data.token);
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-xl font-semibold text-slate-900">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Sign up to pass your books on to someone new.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
          required
        />
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
          {loading ? "Creating..." : "Sign up"}
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

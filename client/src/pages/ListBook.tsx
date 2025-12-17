import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authedMultipartPost } from "../lib/auth";

type Condition = "NEW" | "LIKE_NEW" | "VERY_GOOD" | "GOOD" | "ACCEPTABLE";

export default function ListBook() {
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<Condition>("GOOD");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("author", author);
      fd.append("price", price);
      fd.append("condition", condition);
      if (coverFile) fd.append("cover", coverFile);

      await authedMultipartPost<{ book: any }>("/books", fd);

      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e.message || "Failed to list book");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-xl font-semibold text-slate-900">List a book</h1>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
          required
        />

        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
          required
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (e.g. 12.50)"
          inputMode="decimal"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
          required
        />

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as Condition)}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
        >
          <option value="NEW">New</option>
          <option value="LIKE_NEW">Like new</option>
          <option value="VERY_GOOD">Very good</option>
          <option value="GOOD">Good</option>
          <option value="ACCEPTABLE">Acceptable</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
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
          {loading ? "Listing..." : "List book"}
        </button>
      </form>
    </div>
  );
}

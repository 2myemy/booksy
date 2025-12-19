import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Tag } from "../../components/ui/Tag";

type Book = {
  id: string;
  title: string;
  author: string;
  price_cents: number;
  currency: string;
  condition: string;
  cover_image_url: string | null;
};

const API =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "";

const conditionLabel: Record<string, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  VERY_GOOD: "Very Good",
  GOOD: "Good",
  ACCEPTABLE: "Acceptable",
  FAIR: "Fair",
};

const cardStyle: CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.72)",
  border: "1px solid rgba(180, 83, 9, 0.16)",
  backdropFilter: "blur(6px)",
  boxShadow: "0 10px 28px rgba(59, 47, 42, 0.10)",
};

function formatPrice(price_cents: number) {
  return Math.round(price_cents / 100);
}

export default function Hero() {
  const [latest, setLatest] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const url = `${API}/books?sort=latest&limit=3`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load latest books");

        const data = await res.json(); // { books, meta }
        setLatest(data.books ?? []);
      } catch {
        setLatest([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* background 그대로 유지 */}
      <div className="absolute inset-0 -z-10">
        <div
          className="h-full w-full"
          style={{
            background: "linear-gradient(to bottom, #fbf7f0, #fff7ed, #fff1f2)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2 lg:-translate-y-4">
        {/* LEFT */}
        <div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Your next book is waiting on
            <span className="block" style={{ color: "var(--walnut)" }}>
              someone's shelf.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-lg text-slate-700">
            Buy and sell used or new books safely—keep great stories moving.
          </p>

          <div className="mt-7 flex gap-3">
            <Link
              to="/books"
              className="rounded-xl px-5 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--walnut)" }}
            >
              Browse Books
            </Link>

            <Link
              to="/list"
              className="rounded-xl px-5 py-3 text-sm font-semibold"
              style={{
                backgroundColor: "rgba(255,255,255,0.65)",
                border: "1px solid var(--border)",
                color: "var(--walnut)",
              }}
            >
              List a Book
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <div className="rounded-3xl p-6 shadow-lg" style={cardStyle}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold">Just listed ✨</div>
                <div className="mt-1 text-xs text-slate-600">
                  Fresh finds from the community
                </div>
              </div>
              {loading && (
                <span className="text-xs text-slate-500">Loading…</span>
              )}
            </div>

            {/* EMPTY / DATA */}
            <div className="mt-6 grid gap-4">
              {!loading && latest.length === 0 ? (
                <div className="rounded-2xl border p-6 text-sm text-slate-600">
                  No books yet. Be the first to list one!
                </div>
              ) : (
                latest.map((b) => (
                  <Link
                    key={b.id}
                    to={`/books/${b.id}`}
                    className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-[rgba(59,47,42,0.25)]"
                  >
                    <div
                      className="flex items-center justify-between rounded-2xl p-4 shadow-sm hover:-translate-y-0.5 transition"
                      style={cardStyle}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-12 rounded-md bg-slate-100 overflow-hidden">
                          {b.cover_image_url ? (
                            <img
                              src={b.cover_image_url}
                              alt={b.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-slate-400">
                              No cover
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-sm font-semibold">{b.title}</div>
                          <div className="mt-1 flex gap-2 text-xs">
                            <Tag tone="neutral">by {b.author}</Tag>
                            <Tag tone="meta">
                              {conditionLabel[b.condition] ?? b.condition}
                            </Tag>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          ${formatPrice(b.price_cents)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import taoCover from "../../assets/tao-of-pooh.png";
import franklCover from "../../assets/man-search-for-meaning.png";
import lovingCover from "../../assets/art-of-loving.png";

type Book = {
  id: string;
  title: string;
  author: string;
  price_cents: number;
  currency: string;
  status: string;
  cover_image_url: string | null;
};

const fallbackBooks: Book[] = [
  {
    id: "fallback-1",
    title: "Tao Of Pooh",
    author: "Benjamin Hoff",
    price_cents: 900,
    currency: "USD",
    status: "GOOD",
    cover_image_url: taoCover as any,
  },
  {
    id: "fallback-2",
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    price_cents: 700,
    currency: "USD",
    status: "LIKE_NEW",
    cover_image_url: franklCover as any,
  },
  {
    id: "fallback-3",
    title: "The Art of Loving",
    author: "Erich Fromm",
    price_cents: 1000,
    currency: "USD",
    status: "ACCEPTABLE",
    cover_image_url: lovingCover as any,
  },
];

const conditionLabel: Record<string, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  VERY_GOOD: "Very Good",
  GOOD: "Good",
  ACCEPTABLE: "Acceptable",
  FAIR: "Fair",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.72)",
  border: "1px solid rgba(180, 83, 9, 0.16)",
  backdropFilter: "blur(6px)",
  boxShadow: "0 10px 28px rgba(59, 47, 42, 0.10)",
};

const pillHoney: React.CSSProperties = {
  backgroundColor: "rgba(180, 83, 9, 0.12)",
  color: "var(--honey)",
};

const pillSoft: React.CSSProperties = {
  backgroundColor: "rgba(31, 41, 55, 0.06)",
  color: "rgba(31, 41, 55, 0.75)",
};

export default function Hero() {
  const [latest, setLatest] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const res = await fetch("/books?sort=latest&limit=3");
        if (!res.ok) throw new Error("Failed to load latest books");
        const data = await res.json(); // { books: Book[] } 또는 Book[]

        const list: Book[] = Array.isArray(data) ? data : data.books;
        setLatest((list || []).slice(0, 3));
      } catch {
        setLatest([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const booksToShow = useMemo(() => {
    if (loading) return fallbackBooks;
    if (latest.length > 0) return latest;
    return fallbackBooks;
  }, [loading, latest]);

  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="h-full w-full"
          style={{
            background: "linear-gradient(to bottom, #fbf7f0, #fff7ed, #fff1f2)",
          }}
        />

        {/* ✨ attic paper grain + warm spotlight */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 15%, rgba(180,83,9,0.18), transparent 45%)," +
              "radial-gradient(circle at 80% 30%, rgba(59,47,42,0.10), transparent 55%)," +
              "repeating-linear-gradient(0deg, rgba(59,47,42,0.03) 0px, rgba(59,47,42,0.03) 1px, transparent 1px, transparent 6px)",
            mixBlendMode: "multiply",
          }}
        />

        <div
          className="absolute -top-28 -left-28 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(180, 83, 9, 0.14)" }}
        />
        <div
          className="absolute -bottom-32 -right-28 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(59, 47, 42, 0.10)" }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2 lg:-translate-y-4">
        {/* LEFT */}
        <div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Your next book is waiting on
            <span className="block" style={{ color: "var(--walnut)" }}>
              someone’s shelf.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-700">
            Buy and sell used or new books safely—keep great stories moving.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/books"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
              style={{ backgroundColor: "var(--walnut)" }}
            >
              Browse Books
            </a>

            <a
              href="/list"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition hover:opacity-95"
              style={{
                backgroundColor: "rgba(255,255,255,0.65)",
                border: "1px solid var(--border)",
                color: "var(--walnut)",
                backdropFilter: "blur(10px)",
              }}
            >
              List a Book
            </a>

            <span className="text-sm text-slate-600 sm:ml-2">
              Simple listing · Clear condition tags
            </span>
          </div>

          <div
            className="mt-8 grid grid-cols-3 gap-3 rounded-2xl p-4 text-sm shadow-sm"
            style={cardStyle}
          >
            <div className="text-center">
              <div className="text-sm font-semibold">Secure authentication</div>
              <div className="mt-1 text-xs text-slate-600">JWT-based login</div>
            </div>

            <div className="text-center">
              <div className="text-sm font-semibold">Browse books</div>
              <div className="mt-1 text-xs text-slate-600">Search & filter</div>
            </div>

            <div className="text-center">
              <div className="text-sm font-semibold">Checkout flow</div>
              <div className="mt-1 text-xs text-slate-600">
                Save & message the owner
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <div
            className="rounded-3xl p-6 shadow-lg"
            style={{
              ...cardStyle,
              backgroundColor: "rgba(255,255,255,0.62)",
              border: "1px solid rgba(59,47,42,0.12)",
              boxShadow: "0 24px 80px rgba(59,47,42,0.14)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
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

            <div className="mt-6 grid gap-4">
              {booksToShow.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-2xl p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                  style={cardStyle}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={b.cover_image_url || taoCover}
                      alt={b.title}
                      className="h-16 w-12 rounded-md object-cover shadow-sm"
                      style={{
                        border: "1px solid rgba(59,47,42,0.12)",
                        boxShadow: "0 6px 14px rgba(59,47,42,0.18)",
                        transform: "rotate(-1.5deg)",
                      }}
                    />

                    <div>
                      <div className="text-sm font-semibold">{b.title}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        {b.author && (
                          <span
                            className="rounded-full px-2 py-0.5"
                            style={pillSoft}
                          >
                            by {b.author}
                          </span>
                        )}
                        <span
                          className="rounded-full px-2 py-0.5"
                          style={pillHoney}
                        >
                          {conditionLabel[b.status] ?? b.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      ${b.price_cents}
                    </div>
                    <div className="mt-1 text-xs text-slate-600">incl. tax</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                {
                  t: "Message the owner",
                  d: "Save it and send a quick message.",
                },
                { t: "Honest conditions", d: "Clear tags & notes." },
                { t: "Second life", d: "Keep stories moving." },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl p-4" style={cardStyle}>
                  <div className="text-sm font-semibold">{x.t}</div>
                  <div className="mt-1 text-xs leading-relaxed text-slate-600">
                    {x.d}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="pointer-events-none absolute -bottom-6 left-1/2 h-12 w-4/5 -translate-x-1/2 rounded-full blur-2xl"
            style={{ backgroundColor: "rgba(59, 47, 42, 0.12)" }}
          />
        </div>
      </div>
    </section>
  );
}

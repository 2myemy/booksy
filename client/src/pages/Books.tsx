import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGet } from "../lib/auth";
import BookCard from "../components/books/BookCard";
import { Tag } from "../components/ui/Tag";

type Book = {
  id: string;
  title: string;
  author: string;
  price_cents: number;
  condition: string;
  status: string;
  cover_image_url: string | null;
  username: string;
  created_at?: string; // 서버가 내려주면 활용 가능
};

type BooksResponse = {
  books: Book[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
};

const CONDITIONS = ["ALL", "NEW", "LIKE_NEW", "VERY_GOOD", "GOOD", "ACCEPTABLE"] as const;
type ConditionFilter = (typeof CONDITIONS)[number];

type Sort = "latest" | "price_low" | "price_high";

function parseIntSafe(v: string | null, fallback: number) {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function useDebounced<T>(value: T, delayMs: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);
  return v;
}

function buildParams(input: {
  query: string;
  condition: ConditionFilter;
  min: string;
  max: string;
  sort: Sort;
  limit: number;
  offset: number;
}) {
  const p = new URLSearchParams();

  if (input.query.trim()) p.set("query", input.query.trim());
  if (input.condition !== "ALL") p.set("condition", input.condition);

  if (input.min.trim()) p.set("min", input.min.trim());
  if (input.max.trim()) p.set("max", input.max.trim());

  if (input.sort !== "latest") p.set("sort", input.sort);

  // pagination
  p.set("limit", String(input.limit));
  p.set("offset", String(input.offset));

  return p;
}

export default function Books() {
  const nav = useNavigate();
  const loc = useLocation();

  // ✅ 상태는 URL에서 초기화
  const searchParams = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [condition, setCondition] = useState<ConditionFilter>(
    (searchParams.get("condition") as ConditionFilter) ?? "ALL"
  );
  const [min, setMin] = useState(searchParams.get("min") ?? "");
  const [max, setMax] = useState(searchParams.get("max") ?? "");
  const [sort, setSort] = useState<Sort>((searchParams.get("sort") as Sort) ?? "latest");

  const [limit, setLimit] = useState<number>(parseIntSafe(searchParams.get("limit"), 24));
  const [offset, setOffset] = useState<number>(parseIntSafe(searchParams.get("offset"), 0));

  const [books, setBooks] = useState<Book[]>([]);
  const [meta, setMeta] = useState<BooksResponse["meta"]>({ total: 0, limit: 24, offset: 0 });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // ✅ 디바운스 검색어(타이핑 중에는 서버 호출 안 함)
  const debouncedQuery = useDebounced(query, 350);

  // ✅ URL이 바뀌면 state도 따라가도록 (뒤로가기/공유 링크)
  useEffect(() => {
    const sp = new URLSearchParams(loc.search);

    setQuery(sp.get("query") ?? "");
    setCondition(((sp.get("condition") as ConditionFilter) ?? "ALL") || "ALL");
    setMin(sp.get("min") ?? "");
    setMax(sp.get("max") ?? "");
    setSort(((sp.get("sort") as Sort) ?? "latest") || "latest");

    setLimit(parseIntSafe(sp.get("limit"), 24));
    setOffset(parseIntSafe(sp.get("offset"), 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.search]);

  // ✅ state 변화 → URL 업데이트 (단, debouncedQuery를 사용)
  useEffect(() => {
    // offset은 필터 바뀔 때 0으로 보내는 게 UX 좋음
    // (이 effect는 URL 업데이트만 담당, offset reset은 아래 별도 effect)
    const p = buildParams({
      query: debouncedQuery,
      condition,
      min,
      max,
      sort,
      limit,
      offset,
    });

    const next = `${loc.pathname}?${p.toString()}`;
    const current = `${loc.pathname}${loc.search}`;

    if (next !== current) {
      nav(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, condition, min, max, sort, limit, offset]);

  // ✅ 필터/검색/정렬 바뀌면 offset을 0으로 리셋
  useEffect(() => {
    setOffset(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, condition, min, max, sort, limit]);

  // ✅ 서버 fetch (URL 기반)
  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);

        // loc.search 그대로 서버로 전달
        const data = await apiGet<BooksResponse>(`/books${loc.search}`);
        setBooks(data.books);
        setMeta(data.meta);
      } catch (e: any) {
        setErr(e?.message || "Failed to load books");
        setBooks([]);
        setMeta((m) => ({ ...m, total: 0 }));
      } finally {
        setLoading(false);
      }
    })();
  }, [loc.search]);

  const activeFiltersCount = useMemo(() => {
    let n = 0;
    if (query.trim()) n++;
    if (condition !== "ALL") n++;
    if (min.trim()) n++;
    if (max.trim()) n++;
    if (sort !== "latest") n++;
    return n;
  }, [query, condition, min, max, sort]);

  const clearFilters = () => {
    setQuery("");
    setCondition("ALL");
    setMin("");
    setMax("");
    setSort("latest");
    setLimit(24);
    setOffset(0);
  };

  const page = Math.floor(meta.offset / meta.limit) + 1;
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));
  const canPrev = meta.offset > 0;
  const canNext = meta.offset + meta.limit < meta.total;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Book Market</h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse books listed by the community.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 ? (
            <>
              <Tag tone="neutral">{activeFiltersCount} filter(s)</Tag>
              <button
                onClick={clearFilters}
                className="rounded-xl border px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Clear
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-12">
        {/* Search */}
        <div className="md:col-span-5">
          <label className="text-xs font-semibold text-slate-600">Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title, author, or seller..."
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(59,47,42,0.18)]"
          />
        </div>

        {/* Condition */}
        <div className="md:col-span-3">
          <label className="text-xs font-semibold text-slate-600">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as ConditionFilter)}
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All" : c.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-600">Min $</label>
          <input
            value={min}
            onChange={(e) => setMin(e.target.value)}
            inputMode="decimal"
            placeholder="0"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-600">Max $</label>
          <input
            value={max}
            onChange={(e) => setMax(e.target.value)}
            inputMode="decimal"
            placeholder="999"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
          />
        </div>

        {/* Sort */}
        <div className="md:col-span-3">
          <label className="text-xs font-semibold text-slate-600">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
          >
            <option value="latest">Newest</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
          </select>
        </div>

        {/* Page size */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-600">Per page</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
          >
            {[12, 24, 48].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Result count */}
        <div className="md:col-span-7 flex items-end justify-between gap-3">
          <div className="text-sm text-slate-600">
            {loading ? (
              <span>Loading…</span>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {books.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {meta.total}
                </span>
              </>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button
              disabled={!canPrev || loading}
              onClick={() => setOffset((o) => Math.max(0, o - limit))}
              className={[
                "rounded-xl border px-3 py-2 text-sm font-semibold",
                !canPrev || loading
                  ? "cursor-not-allowed text-slate-400"
                  : "text-slate-900 hover:bg-slate-50",
              ].join(" ")}
            >
              Prev
            </button>
            <Tag tone="neutral">
              Page {page} / {totalPages}
            </Tag>
            <button
              disabled={!canNext || loading}
              onClick={() => setOffset((o) => o + limit)}
              className={[
                "rounded-xl border px-3 py-2 text-sm font-semibold",
                !canNext || loading
                  ? "cursor-not-allowed text-slate-400"
                  : "text-slate-900 hover:bg-slate-50",
              ].join(" ")}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {err && (
        <div
          className="mt-6 rounded-xl border p-3 text-sm"
          style={{
            borderColor: "rgba(220,38,38,0.25)",
            backgroundColor: "rgba(220,38,38,0.06)",
          }}
        >
          {err}
        </div>
      )}

      {/* Empty state */}
      {!err && !loading && books.length === 0 ? (
        <div className="mt-10 rounded-2xl border bg-white p-10 text-center shadow-sm">
          <div className="text-sm text-slate-600">
            No books match your search.
          </div>
          <button
            onClick={clearFilters}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}

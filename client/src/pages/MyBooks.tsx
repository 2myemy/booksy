import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authedGet } from "../lib/auth";
import BookCard from "../components/books/BookCard";

type Book = {
  id: string;
  title: string;
  author: string;
  price_cents: number;
  currency: string;
  status: string;
  cover_image_url: string | null;
};

export default function MyBooks() {
  const nav = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const data = await authedGet<{ books: Book[] }>("/books/mine");
        setBooks(data.books);
      } catch (e: any) {
        setErr(e.message || "Failed to load my books");
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-xl font-semibold text-slate-900">My Books</h1>
      <p className="mt-1 text-sm text-slate-600">Books you've listed.</p>

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

      {!err && books.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-lg font-medium text-slate-700">
            Start sharing your book journey with others.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Your listed books will appear here.
          </p>
          <button
            type="button"
            onClick={() => nav("/list")}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:translate-y-[1px]"
          >
            List your first book
          </button>
        </div>
      )}

      {books.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((b) => (
            <BookCard key={b.id} book={b as any} />
          ))}
        </div>
      )}
    </div>
  );
}

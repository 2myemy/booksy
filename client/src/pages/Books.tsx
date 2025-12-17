import { useEffect, useState } from "react";
import { apiGet } from "../lib/auth";
import BookCard from "../components/books/BookCard";

type Book = {
  id: string;
  title: string;
  author: string;
  price_cents: number;
  condition: string;
  status: string;
  cover_image_url: string | null;
  username: string;
};

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const data = await apiGet<{ books: Book[] }>("/books");
        setBooks(data.books);
      } catch (e: any) {
        setErr(e.message || "Failed to load books");
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Book Market</h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse books listed by the community.
          </p>
        </div>
      </div>

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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {books.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
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
      <p className="mt-1 text-sm text-slate-600">
        Books you’ve listed.
      </p>

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

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((b) => (
          <BookCard key={b.id} book={b as any} />
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { cloudThumb } from "../../lib/cloudinary";

type Book = {
  id: string;
  title: string;
  author: string;
  price_cents: number;
  condition: string;
  status: string;
  cover_image_url: string | null;
  username?: string;
};

function formatPrice(price_cents: number) {
  const amount = price_cents / 100;
  return Math.round(amount);
}

export default function BookCard({ book }: { book: Book }) {
  const img = cloudThumb(book.cover_image_url, 320, 420);

  return (
    <Link
      to={`/books/${book.id}`}
      className="block overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300"
    >
      <div className="aspect-[3/4] w-full bg-slate-100">
        {img ? (
          <img
            src={img}
            alt={book.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No cover
          </div>
        )}
      </div>

      <div className="space-y-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {book.title}
            </p>
            <p className="truncate text-sm text-slate-600">{book.author}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-slate-900">
            ${formatPrice(book.price_cents)}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{book.condition.replaceAll("_", " ")}</span>
          {book.username ? <span>@{book.username}</span> : null}
        </div>
      </div>
    </Link>
  );
}

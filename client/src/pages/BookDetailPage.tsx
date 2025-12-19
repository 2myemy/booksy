import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiGet } from "../lib/auth";
import { cloudThumb } from "../lib/cloudinary";
import { addToCart, isInCart, type CartItem } from "../lib/cart";
import { Tag } from "../components/ui/Tag";

type BookDetail = {
  id: string;
  title: string;
  author: string;
  price_cents: number;
  condition: string;
  status: string;
  cover_image_url: string | null;
  username: string;
  owner_id: string;
  created_at: string;
};

function formatPrice(price_cents: number) {
  const amount = price_cents / 100;
  return Math.round(amount);
}
function formatCondition(cond: string) {
  return cond.replaceAll("_", " ");
}

export default function BookDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [book, setBook] = useState<BookDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [inCart, setInCart] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const heroImg = useMemo(() => {
    if (!book) return null;
    return cloudThumb(book.cover_image_url, 720, 960);
  }, [book]);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const data = await apiGet<{ book: BookDetail }>(`/books/${id}`);
        setBook(data.book);

        // ✅ fetch 후 카트 상태 동기화
        setInCart(isInCart(data.book.id));
      } catch (e: any) {
        setErr(e?.message || "Failed to load book");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleMessageSeller = () => {
    // if (!book) return;
    // const params = new URLSearchParams({
    //   to: book.owner_id,
    //   username: book.username,
    //   bookId: book.id,
    //   bookTitle: book.title,
    // });
    // nav(`/messages/new?${params.toString()}`);
    alert("Message Seller coming soon :)");
  };

  const handleAddToCart = () => {
    if (!book) return;

    const item: CartItem = {
      bookId: book.id,
      title: book.title,
      author: book.author,
      price_cents: book.price_cents,
      cover_image_url: book.cover_image_url,
      sellerUsername: book.username,
      addedAt: new Date().toISOString(),
    };

    const { added } = addToCart(item);

    if (added) {
      setInCart(true);
      setNotice("Added to cart ✅");
    } else {
      setNotice("Already in cart");
    }

    // notice 자동 제거
    window.clearTimeout((handleAddToCart as any)._t);
    (handleAddToCart as any)._t = window.setTimeout(
      () => setNotice(null),
      1600
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="text-sm text-slate-600">Loading…</div>
      </div>
    );
  }

  if (err || !book) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <Link to="/books" className="text-sm text-slate-700 hover:underline">
          ← Back to market
        </Link>
        <div
          className="mt-4 rounded-xl border p-3 text-sm"
          style={{
            borderColor: "rgba(220,38,38,0.25)",
            backgroundColor: "rgba(220,38,38,0.06)",
          }}
        >
          {err || "Book not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between gap-3">
        <Link to="/books" className="text-sm text-slate-700 hover:underline">
          ← Back to market
        </Link>

        <Tag tone="success">{book.status}</Tag>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-100">
            {heroImg ? (
              <img
                src={heroImg}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No cover image
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <Tag tone="neutral">
                {formatCondition(book.condition)}
              </Tag>
              <Tag tone="meta">
                Listed {new Date(book.created_at).toLocaleDateString()}
              </Tag>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {book.title}
          </h1>
          <p className="mt-2 text-lg text-slate-700">{book.author}</p>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <div className="text-xs text-slate-500">Price</div>
              <div className="mt-1 text-4xl font-semibold text-slate-900">
                ${formatPrice(book.price_cents)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">Seller</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                @{book.username}
              </div>
            </div>
          </div>

          {/* ✅ Actions 카드 */}
          <div className="mt-8 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              {notice ? (
                <span className="text-xs text-slate-600">{notice}</span>
              ) : (
                <span className="text-xs text-slate-500">
                  {inCart ? "In your cart" : "Not in cart"}
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={handleMessageSeller}
                className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Message seller
              </button>

              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={[
                  "w-full rounded-xl px-4 py-2.5 text-sm font-semibold",
                  inCart
                    ? "cursor-not-allowed bg-slate-100 text-slate-500"
                    : "border text-slate-900 hover:bg-slate-50",
                ].join(" ")}
              >
                {inCart ? "Added" : "Add to cart"}
              </button>
            </div>

            {inCart ? (
              <button
                onClick={() => nav("/cart")}
                className="mt-3 w-full rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Go to cart
              </button>
            ) : null}

            <p className="mt-3 text-xs text-slate-500">
              Tip: keep messages and transactions on Booksy for safety.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

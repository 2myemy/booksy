import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cloudThumb } from "../lib/cloudinary";
import {
  getCart,
  removeFromCart,
  setCart,
  type CartItem,
} from "../lib/cart";

function formatPrice(price_cents: number) {
  const amount = price_cents / 100;
  return Math.round(amount);
}

export default function CartPage() {
  const nav = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const totalCents = useMemo(
    () => items.reduce((sum, it) => sum + it.price_cents, 0),
    [items]
  );

  const handleRemove = (bookId: string) => {
    const next = removeFromCart(bookId);
    setItems(next);
  };

  const handleClear = () => {
    setCart([]);
    setItems([]);
  };

  const handleCheckout = () => {
    alert("Checkout coming soon :)");
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Your Cart</h1>
          <p className="mt-1 text-sm text-slate-600">
            Review items before checkout.
          </p>
        </div>

        <Link to="/books" className="text-sm text-slate-700 hover:underline">
          Continue shopping →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border bg-white p-8 text-center shadow-sm">
          <div className="text-sm text-slate-600">Your cart is empty.</div>
          <button
            onClick={() => nav("/books")}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Browse books
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => {
              const img = cloudThumb(it.cover_image_url, 200, 260);
              return (
                <div
                  key={it.bookId}
                  className="flex gap-4 rounded-2xl border bg-white p-4 shadow-sm"
                >
                  <Link
                    to={`/books/${it.bookId}`}
                    className="h-[130px] w-[100px] overflow-hidden rounded-xl bg-slate-100 shrink-0"
                    title="View book"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={it.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-500">
                        No cover
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/books/${it.bookId}`}
                          className="block truncate text-sm font-semibold text-slate-900 hover:underline"
                        >
                          {it.title}
                        </Link>
                        <div className="mt-1 truncate text-sm text-slate-600">
                          {it.author}
                        </div>
                        {it.sellerUsername ? (
                          <div className="mt-2 text-xs text-slate-500">
                            Seller: @{it.sellerUsername}
                          </div>
                        ) : null}
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-sm font-semibold text-slate-900">
                          ${formatPrice(it.price_cents)}
                        </div>
                        <button
                          onClick={() => handleRemove(it.bookId)}
                          className="mt-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                      Added {new Date(it.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm h-fit">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">
                Order Summary
              </div>
              <div className="text-xs text-slate-500">{items.length} item(s)</div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-900">
                {formatPrice(totalCents)}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">Estimated tax</span>
              <span className="text-slate-500">—</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">Shipping</span>
              <span className="text-slate-500">—</span>
            </div>

            <div className="my-4 border-t" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Total</span>
              <span className="text-lg font-semibold text-slate-900">
                {formatPrice(totalCents)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Checkout
            </button>

            <button
              onClick={handleClear}
              className="mt-3 w-full rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Clear cart
            </button>

            <p className="mt-3 text-xs text-slate-500">
              MVP: checkout will be added later. For now, use "Message seller" on
              each book to coordinate purchase.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

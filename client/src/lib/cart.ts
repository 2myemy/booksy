export type CartItem = {
  bookId: string;
  title: string;
  author: string;
  price_cents: number;
  cover_image_url: string | null;
  sellerUsername?: string;
  addedAt: string;
};

const CART_KEY = "booksy_cart_v1";

export const CART_EVENT = "booksy:cart";

function emitCartChanged() {
  window.dispatchEvent(new Event(CART_EVENT));
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  emitCartChanged();
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const exists = cart.some((x) => x.bookId === item.bookId);
  if (exists) return { added: false, cart };
  const next = [item, ...cart];
  setCart(next);
  return { added: true, cart: next };
}

export function removeFromCart(bookId: string) {
  const cart = getCart();
  const next = cart.filter((x) => x.bookId !== bookId);
  setCart(next);
  return next;
}

export function isInCart(bookId: string) {
  return getCart().some((x) => x.bookId === bookId);
}

export function cartCount() {
  return getCart().length;
}

export default function Footer() {
  return (
    <footer className="border-t border-amber-200/60 bg-white/40">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
        © {new Date().getFullYear()} Booksy — Cozy indie-bookshop marketplace.
      </div>
    </footer>
  );
}

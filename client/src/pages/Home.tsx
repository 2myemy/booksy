import Hero from "../components/home/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl border border-amber-200/60 bg-white/50 p-8 shadow-sm backdrop-blur">
          <h2 className="text-xl font-semibold">Popular picks (coming soon)</h2>
        </div>
      </section>
    </main>
  );
}

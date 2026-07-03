import Link from "next/link";

const highlights = [
  {
    title: "Bold Storytelling",
    description: "Original voices and narratives that inspire across cultures.",
  },
  {
    title: "Craft & Quality",
    description: "Every frame held to the highest standard of cinematic excellence.",
  },
  {
    title: "Global Vision",
    description: "Films reaching audiences worldwide with diverse stories on screen.",
  },
];

export default function HomeAboutSection() {
  return (
    <section className="border-y border-zinc-800 bg-zinc-900/20 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
              About Us
            </p>
            <h2 className="mt-3 text-2xl font-bold text-zinc-50 sm:text-3xl md:text-4xl">
              We believe in the power of cinema
            </h2>
            <p className="mt-4 leading-relaxed text-zinc-400 sm:mt-6">
              Movie Studio is an independent production house dedicated to
              telling stories that matter — stories that stay with you long after
              the credits roll.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block rounded-full border border-amber-500/50 px-6 py-2.5 text-sm font-semibold text-amber-400 transition-colors hover:bg-amber-500/10 hover:text-amber-300"
            >
              Learn More About Us
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-8">
            <h3 className="text-base font-semibold text-amber-400 sm:text-lg">
              Our Mission
            </h3>
            <p className="mt-3 text-lg font-medium leading-snug text-zinc-100 sm:text-xl">
              &ldquo;To create unforgettable cinematic experiences that connect
              people across borders, backgrounds, and beliefs.&rdquo;
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-5"
            >
              <h3 className="font-semibold text-zinc-50">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

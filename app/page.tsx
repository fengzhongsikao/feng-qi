import Link from "next/link";
import { refresh } from "next/cache";
import { type CustomPoem } from "@/lib/types";

const API_BASE = "http://122.51.104.131:8000";

async function getPoem(): Promise<CustomPoem> {
  const res = await fetch(`${API_BASE}/api/poems/random`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const poem = await getPoem();

  async function refreshPoem() {
    "use server";
    refresh();
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold tracking-wide">{poem.title}</h1>
        <span className="text-sm text-rose-600 dark:text-rose-400">
          <Link href={`/search?author=${encodeURIComponent(poem.author)}`} className="hover:underline">
            {poem.author}
          </Link>
        </span>
        <div className="flex flex-col gap-3 text-lg leading-relaxed text-center font-semibold">
          {poem.paragraphs.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <form action={refreshPoem}>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground text-sm font-medium h-8 gap-1.5 px-2.5 whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50"
          >
            换一首
          </button>
        </form>
      </main>
    </div>
  );
}

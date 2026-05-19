import Link from "next/link";
import { refresh } from "next/cache";
import { type PoemData } from "@/lib/types";

async function getPoem(): Promise<PoemData> {
  const res = await fetch("https://poetry.palemoky.com/api/poems/random", {
    cache: "no-store",
  });
  const json = await res.json();
  return json.data;
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
        <span className="text-sm text-amber-600 dark:text-amber-400">{poem.type.name}</span>
        <span className="text-sm text-rose-600 dark:text-rose-400">
          <Link href={`/search?q=${encodeURIComponent(poem.dynasty.name)}`} className="hover:underline">
            {poem.dynasty.name}
          </Link>
          {" · "}
          <Link href={`/search?q=${encodeURIComponent(poem.author.name)}&type=author`} className="hover:underline">
            {poem.author.name}
          </Link>
        </span>
        <div className="flex flex-col gap-3 text-lg leading-relaxed text-center font-semibold">
          {poem.content.map((line, index) => (
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

import Link from "next/link";
import { type ApiResponse, type PoemData } from "@/lib/types";
import { API_BASE } from "@/lib/config";

async function getPoem(): Promise<ApiResponse<PoemData>> {
  const res = await fetch(`${API_BASE}/api/poems/random?lang=zh-Hant`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ refresh?: string }>;
}) {
  await searchParams;
  const res = await getPoem().catch((e) => {
    console.error("获取诗词失败:", e);
    return null;
  });
  const poem = res?.data;

  if (!poem) {
    return <div className="flex flex-1 items-center justify-center p-8 text-zinc-500">暂无数据</div>;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold tracking-wide">{poem.title}</h1>
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          {poem.dynasty && <span>{poem.dynasty.name}</span>}
          <Link href={`/search?author=${encodeURIComponent(poem.author.name)}`} className="hover:underline">
            {poem.author.name}
          </Link>
        </div>
        {poem.type && <span className="text-sm text-rose-600 dark:text-rose-400">{poem.type.name}</span>}
        <div className="flex flex-col gap-3 text-lg leading-relaxed text-center font-semibold">
          {poem.content.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <Link
          href="/?refresh=1"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground text-sm font-medium h-8 gap-1.5 px-2.5 whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50"
        >
          换一首
        </Link>
      </main>
    </div>
  );
}

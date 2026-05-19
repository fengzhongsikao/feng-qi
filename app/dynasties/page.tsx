import Link from "next/link";
import { type PoemDynasty } from "@/lib/types";

async function getDynasties(): Promise<PoemDynasty[]> {
  const res = await fetch("https://poetry.palemoky.com/api/dynasties", {
    cache: "no-store",
  });
  const json = await res.json();
  return json.data;
}

export default async function DynastiesPage() {
  const dynasties = await getDynasties();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 py-12 px-16 bg-white dark:bg-black">
        <h1 className="text-2xl font-bold tracking-wide">朝代</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {dynasties.map((dynasty) => (
            <Link
              key={dynasty.id}
              href={`/search?q=${encodeURIComponent(dynasty.name)}`}
              className="rounded-lg border border-border bg-card p-4 text-center text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
            >
              {dynasty.name}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

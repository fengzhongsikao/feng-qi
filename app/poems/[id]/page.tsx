import Link from "next/link";
import { notFound } from "next/navigation";
import { type ApiResponse, type PoemData } from "@/lib/types";

async function getPoem(id: string): Promise<PoemData | null> {
  const res = await fetch(`https://poetry.palemoky.com/api/poems/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json: ApiResponse<PoemData> = await res.json();
  return json.data;
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const poem = await getPoem(id);
  if (!poem) notFound();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold tracking-wide">{poem.title}</h1>
        <span className="text-sm text-amber-600 dark:text-amber-400">
          {poem.type.name}
        </span>
        <span className="text-sm text-rose-600 dark:text-rose-400">
          <Link
            href={`/search?q=${encodeURIComponent(poem.dynasty.name)}`}
            className="hover:underline"
          >
            {poem.dynasty.name}
          </Link>
          {" · "}
          <Link
            href={`/search?q=${encodeURIComponent(poem.author.name)}&type=author`}
            className="hover:underline"
          >
            {poem.author.name}
          </Link>
        </span>
        <div className="flex flex-col gap-3 text-lg leading-relaxed text-center font-semibold">
          {poem.content.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </main>
    </div>
  );
}

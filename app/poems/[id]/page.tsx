import Link from "next/link";
import { notFound } from "next/navigation";
import { type CustomPoem } from "@/lib/types";

const API_BASE = "http://122.51.104.131:8000";

async function getPoem(id: string): Promise<CustomPoem | null> {
  const res = await fetch(`${API_BASE}/api/poems/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
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
        <span className="text-sm text-rose-600 dark:text-rose-400">
          <Link
            href={`/search?author=${encodeURIComponent(poem.author)}`}
            className="hover:underline"
          >
            {poem.author}
          </Link>
        </span>
        <div className="flex flex-col gap-3 text-lg leading-relaxed text-center font-semibold">
          {poem.paragraphs.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </main>
    </div>
  );
}

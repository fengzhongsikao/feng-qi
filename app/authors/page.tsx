import Link from "next/link";
import { type PoemAuthor, type PaginatedResponse } from "@/lib/types";

const DEFAULT_PAGE_SIZE = 24;

async function getAuthors(
  page: number,
  pageSize: number
): Promise<{ authors: PoemAuthor[]; hasMore: boolean }> {
  const res = await fetch(
    `https://poetry.palemoky.com/api/authors?page=${page}&pageSize=${pageSize}`,
    {
      cache: "no-store",
    }
  );
  const json: PaginatedResponse<PoemAuthor> = await res.json();
  return { authors: json.data, hasMore: json.pagination.hasMore };
}

export default async function AuthorsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.max(1, Number(params.pageSize) || DEFAULT_PAGE_SIZE);
  const { authors, hasMore } = await getAuthors(page, pageSize);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 py-12 px-16 bg-white dark:bg-black">
        <h1 className="text-2xl font-bold tracking-wide">作者</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {authors.map((author) => (
            <div
              key={author.id}
              className="rounded-lg border border-border bg-card p-4 text-center"
            >
              <Link
                href={`/search?q=${encodeURIComponent(author.name)}&type=author`}
                className="block text-sm font-medium transition-colors hover:text-primary"
              >
                {author.name}
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(author.dynasty.name)}`}
                className="block mt-1 text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {author.dynasty.name}
              </Link>
            </div>
          ))}
        </div>
        <nav className="flex items-center justify-center gap-4 mt-2">
          {page > 1 && (
            <Link
              href={`/authors?page=${page - 1}&pageSize=${pageSize}`}
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
            >
              上一页
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            第 {page} 页
          </span>
          {hasMore && (
            <Link
              href={`/authors?page=${page + 1}&pageSize=${pageSize}`}
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
            >
              下一页
            </Link>
          )}
        </nav>
      </main>
    </div>
  );
}

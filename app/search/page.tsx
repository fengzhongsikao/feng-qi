import Link from "next/link";
import { type PaginatedResponse, type PoemData } from "@/lib/types";

const DEFAULT_PAGE_SIZE = 20;

const typeLabels: Record<string, string> = {
  title: "标题",
  content: "内容",
  author: "作者",
};

async function searchPoems(
  keyword: string,
  type: string,
  page: number,
  pageSize: number
): Promise<{ poems: PoemData[]; hasMore: boolean }> {
  const typeParam = type ? `&type=${encodeURIComponent(type)}` : "";
  const res = await fetch(
    `https://poetry.palemoky.com/api/search?q=${encodeURIComponent(keyword)}${typeParam}&page=${page}&pageSize=${pageSize}`,
    {
      cache: "no-store",
    }
  );
  const json: PaginatedResponse<PoemData> = await res.json();
  return { poems: json.data, hasMore: json.pagination.hasMore };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string; pageSize?: string }>;
}) {
  const params = await searchParams;
  const keyword = params.q ?? "";
  const type = params.type ?? "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.max(1, Number(params.pageSize) || DEFAULT_PAGE_SIZE);
  const { poems, hasMore } = keyword
    ? await searchPoems(keyword, type, page, pageSize)
    : { poems: [], hasMore: false };

  const typeLabel = typeLabels[type] ?? "全文";
  const typeParam = type ? `&type=${encodeURIComponent(type)}` : "";

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 py-12 px-16 bg-white dark:bg-black">
        <h1 className="text-2xl font-bold tracking-wide">
          搜索{keyword ? `：${keyword}` : ""}
          {keyword && type && (
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({typeLabel})
            </span>
          )}
        </h1>
        {!keyword ? (
          <p className="text-sm text-muted-foreground">请输入关键词搜索诗词</p>
        ) : poems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            未找到与 &ldquo;{keyword}&rdquo; 相关的诗词
          </p>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">
              共找到 {poems.length} 首
            </span>
            <div className="flex flex-col gap-2">
              {poems.map((poem) => (
                <article
                  key={poem.id}
                  className="rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/poems/${poem.id}`}
                      className="font-medium hover:underline"
                    >
                      {poem.title}
                    </Link>
                    <span className="text-sm text-muted-foreground">
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
                  </div>
                  <Link
                    href={`/poems/${poem.id}`}
                    className="mt-2 block text-sm leading-relaxed text-muted-foreground line-clamp-3 hover:underline"
                  >
                    {poem.content.slice(0, 3).join(" / ")}
                  </Link>
                </article>
              ))}
            </div>
            <nav className="flex items-center justify-center gap-4 mt-2">
              {page > 1 && (
                <Link
                  href={`/search?q=${encodeURIComponent(keyword)}${typeParam}&page=${page - 1}&pageSize=${pageSize}`}
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
                  href={`/search?q=${encodeURIComponent(keyword)}${typeParam}&page=${page + 1}&pageSize=${pageSize}`}
                  className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                >
                  下一页
                </Link>
              )}
            </nav>
          </>
        )}
      </main>
    </div>
  );
}

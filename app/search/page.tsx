import Link from "next/link";

import { type CustomPoem, type CustomPoemsResponse } from "@/lib/types";

const API_BASE = "http://122.51.104.131:8000";
const DEFAULT_PAGE_SIZE = 20;

const typeLabels: Record<string, string> = {
  title: "标题",
  author: "作者",
};

function buildSearchParams(keyword: string, type: string, page: number, pageSize: number): URLSearchParams {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("page_size", String(pageSize));

  if (type === "title") {
    params.set("title", keyword);
  } else if (type === "author") {
    params.set("author", keyword);
  } else {
    params.set("keyword", keyword);
  }

  return params;
}

async function searchPoems(
  keyword: string,
  type: string,
  page: number,
  pageSize: number
): Promise<{ poems: CustomPoem[]; hasMore: boolean }> {
  const params = buildSearchParams(keyword, type, page, pageSize);
  const res = await fetch(
    `${API_BASE}/api/poems/search?${params.toString()}`,
    {
      next: { revalidate: 300 },
    }
  );
  const json: CustomPoemsResponse = await res.json();
  const hasMore = json.page * json.page_size < json.total;
  return { poems: json.data, hasMore };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ author?: string; title?: string; keyword?: string; page?: string; pageSize?: string }>;
}) {
  const params = await searchParams;
  const author = params.author ?? "";
  const title = params.title ?? "";
  const keyword = params.keyword ?? "";

  let searchTerm = "";
  let searchType = "";
  let searchParamName = "keyword";

  if (author) {
    searchTerm = author;
    searchType = "author";
    searchParamName = "author";
  } else if (title) {
    searchTerm = title;
    searchType = "title";
    searchParamName = "title";
  } else if (keyword) {
    searchTerm = keyword;
    searchType = "keyword";
    searchParamName = "keyword";
  }

  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.max(1, Number(params.pageSize) || DEFAULT_PAGE_SIZE);
  const { poems, hasMore } = searchTerm
    ? await searchPoems(searchTerm, searchType, page, pageSize)
    : { poems: [], hasMore: false };

  const typeLabel = typeLabels[searchType] ?? "";

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 py-12 px-16 bg-white dark:bg-black">
        <h1 className="text-2xl font-bold tracking-wide">
          搜索{searchTerm ? `：${searchTerm}` : ""}
          {searchTerm && typeLabel && (
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({typeLabel})
            </span>
          )}
        </h1>
        {!searchTerm ? (
          <p className="text-sm text-muted-foreground">请输入关键词搜索诗词</p>
        ) : poems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            未找到与 &ldquo;{searchTerm}&rdquo; 相关的诗词
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
                        href={`/search?author=${encodeURIComponent(poem.author)}`}
                        className="hover:underline"
                      >
                        {poem.author}
                      </Link>
                    </span>
                  </div>
                  <Link
                    href={`/poems/${poem.id}`}
                    className="mt-2 block text-sm leading-relaxed text-muted-foreground line-clamp-3 hover:underline"
                  >
                    {poem.paragraphs.slice(0, 3).join(" / ")}
                  </Link>
                </article>
              ))}
            </div>
            <nav className="flex items-center justify-center gap-4 mt-2">
              {page > 1 && (
                <Link
                  href={`/search?${searchParamName}=${encodeURIComponent(searchTerm)}&page=${page - 1}&pageSize=${pageSize}`}
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
                  href={`/search?${searchParamName}=${encodeURIComponent(searchTerm)}&page=${page + 1}&pageSize=${pageSize}`}
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

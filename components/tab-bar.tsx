"use client";

import Link from "next/link";
import Form from "next/form";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tabs = [
  { label: "首页", href: "/" },
  { label: "作者", href: "/authors" },
];

const searchTypes = [
  { value: "", label: "全文" },
  { value: "title", label: "标题" },
  { value: "content", label: "内容" },
  { value: "author", label: "作者" },
];

export function TabBar() {
  const pathname = usePathname();
  const [type, setType] = useState<string | null>(null);

  const searchParamName =
    type === "author" ? "author"
    : type === "title" ? "title"
    : "keyword";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-4xl items-center gap-1 px-4">
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex-1" />
        <Form action="/search" className="flex items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              name={searchParamName}
              type="text"
              placeholder="搜索诗词..."
              className="h-8 w-36 rounded-l-md border border-input bg-background pl-8 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger
              size="default"
              className="h-8 w-16 border-y border-x-0 rounded-none border-input bg-background px-2 text-xs text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 data-placeholder:text-muted-foreground"
            >
              <SelectValue>
                {(value: string | null) =>
                  searchTypes.find((t) => t.value === value)?.label ?? "全文"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              align="end"
              side="bottom"
              alignItemWithTrigger={false}
              className="z-[100]"
            >
              {searchTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="submit"
            className="inline-flex items-center justify-center h-8 w-8 rounded-r-md border border-l-0 border-input bg-background text-muted-foreground hover:bg-muted transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
          >
            <Search className="size-4 pointer-events-none" />
          </button>
        </Form>
      </div>
    </header>
  );
}

import Link from "next/link";

/**
 * 共用頁首。
 * 排版採「左右式」：網站標題靠左、導覽列靠右，同一行（你在階段 1 開始前選的方向）。
 *
 * 導覽列放「首頁」「關於」兩個連結。/tags/[tag] 沒有列表頁（CLAUDE.md 沒有規劃
 * 標籤索引頁），只能從文章上的標籤點進去，所以不放在導覽列。
 */
export default function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold">
          SPACE R
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/">首頁</Link>
          <Link href="/about">關於</Link>
        </nav>
      </div>
    </header>
  );
}

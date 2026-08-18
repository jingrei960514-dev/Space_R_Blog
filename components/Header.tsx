import Link from "next/link";

/**
 * 共用頁首。
 * 排版採「左右式」：網站標題靠左、導覽列靠右，同一行（你在階段 1 開始前選的方向）。
 *
 * 導覽列目前只放「首頁」一個連結。/about、/tags/[tag] 要到階段 3 才會真的做出頁面，
 * 現在先放連結的話點下去會是 404，所以先不放，等頁面做出來了再一起加。
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
        </nav>
      </div>
    </header>
  );
}

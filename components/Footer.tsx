/**
 * 共用頁尾。
 * 放版權宣告跟 RSS 訂閱連結，之後有需要（例如加社群連結）再擴充。
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6 text-sm text-black/50 dark:text-white/50">
        <span>© {year} SPACE R</span>
        <a href="/rss.xml" className="hover:underline">
          RSS
        </a>
      </div>
    </footer>
  );
}

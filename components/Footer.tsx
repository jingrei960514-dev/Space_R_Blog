/**
 * 共用頁尾。
 * 第一版只放版權宣告，之後有需要（例如加社群連結）再擴充。
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-6 py-6 text-sm text-black/50 dark:text-white/50">
        © {year} SPACE R
      </div>
    </footer>
  );
}

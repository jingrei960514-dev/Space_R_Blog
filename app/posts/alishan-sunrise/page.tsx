/**
 * 階段 1：文章內容先直接寫死在元件裡，用固定路徑 /posts/alishan-sunrise 呈現。
 * 階段 2 才會改成動態路由 /posts/[slug]，改讀 /content/posts/alishan-sunrise.md
 * 這個檔案，並用 remark/rehype 把 Markdown 轉成這裡看到的 HTML 結構。
 *
 * 內文排版（字級、行高、最大寬度等 CLAUDE.md 要求的中文排版細節）留到階段 3
 * 一起處理，這裡先求「頁面結構打得出來、看得懂」。
 */
export default function AlishanSunrisePost() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">阿里山看日出的那一天</h1>
      <p className="mt-2 text-sm text-black/50 dark:text-white/50">
        2026-08-20
      </p>

      <div className="mt-8 flex flex-col gap-4 leading-relaxed">
        <p>
          凌晨三點，鬧鐘響的時候我幾乎想直接關掉繼續睡。但想到已經訂好了小火車的票，
          還是掙扎著爬了起來。
        </p>
        <p>
          山上的空氣冷得刺骨，排隊等日出的人比我想像中還多。大家都安靜地看著東方的天空，
          等待雲海之上的那道光。
        </p>
        <p>
          十分鐘，太陽整個跳出雲海只花了十分鐘。但那十分鐘，值得凌晨三點的鬧鐘。
        </p>
      </div>
    </article>
  );
}

import type { Metadata } from "next";

// 讓瀏覽器分頁標題顯示「關於」，而不是全站統一的「SPACE R」。
export const metadata: Metadata = {
  title: "關於",
};

/**
 * 關於頁：一頁靜態內容，內容直接寫死在這裡就好——
 * 只有這一頁，不需要像文章一樣走 Markdown 解析那條路。
 */
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[36em] px-6 py-12">
      <h1 className="text-3xl font-bold">關於</h1>
      <div className="mt-8 flex flex-col gap-6 text-[17px] leading-[1.8] md:text-[18px]">
        <p>
          嗨，我是涂景睿，目前就讀國立台灣大學資訊管理學系，雙主修創新學系。
        </p>
        <p>平常喜歡重訓、打球，這個部落格用來記錄學習心得、旅行遊記，還有一些生活感悟。</p>
      </div>
    </div>
  );
}

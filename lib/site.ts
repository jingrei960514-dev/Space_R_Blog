/**
 * 全站共用的基本資訊。layout.tsx、sitemap.ts、rss.xml 都需要同一份網站標題／
 * 描述／網址，集中寫在這裡，不要在每個檔案各自重複一份、之後容易改到漏掉。
 */
export const SITE_NAME = "SPACE R";
export const SITE_DESCRIPTION = "記錄學習心得、旅行遊記與生活感悟的個人部落格。";

/**
 * 網站正式網址。sitemap、RSS 裡的連結、SEO 用的 og:url 都需要「完整網址」
 * （不能只寫 /posts/xxx），所以需要知道網站部署後的網域。
 *
 * 部署到 Vercel 後，請在 Vercel 專案的 Environment Variables 設定
 * NEXT_PUBLIC_SITE_URL（例如 https://your-blog.vercel.app 或自訂網域），
 * 設定完要重新 deploy 一次才會生效。本機開發沒設定的話，預設用 localhost。
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

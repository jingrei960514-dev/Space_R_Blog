import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  // metadataBase 讓下面（以及各頁面 generateMetadata 回傳）的相對路徑，
  // 能被自動組成完整網址，例如 og:image、canonical URL。
  metadataBase: new URL(SITE_URL),
  // title.template 讓子頁面只要回傳自己的標題（例如文章標題），
  // 瀏覽器分頁跟搜尋結果實際顯示時會自動補上「| SPACE R」。
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "zh_TW",
  },
  // 讓 RSS 閱讀器／瀏覽器能自動偵測到 /rss.xml 這個訂閱來源。
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant" className="h-full">
      {/*
        body 用 flex-col + min-h-full，讓 <main> 在內容不夠長時可以撐開，
        把 Footer 推到視窗底部，不會出現「頁面很短、Footer 卡在文字正下方」的狀況。
      */}
      <body className="flex min-h-full flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Vercel Analytics：只在部署到 Vercel 的環境才會實際回報數據，本機開發不影響。 */}
        <Analytics />
      </body>
    </html>
  );
}

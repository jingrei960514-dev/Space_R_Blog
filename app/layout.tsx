import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPACE R",
  description: "記錄學習心得、旅行遊記與生活感悟的個人部落格。",
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
      </body>
    </html>
  );
}

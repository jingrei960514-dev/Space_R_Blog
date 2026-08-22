import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Next.js 內建的 robots 產生機制：build 時自動變成 /robots.txt。
 * 這個部落格沒有會員/後台頁面要擋爬蟲，所以全站開放索引，
 * 並指向 sitemap.xml 方便搜尋引擎找到所有頁面。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

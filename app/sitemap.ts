import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

/**
 * Next.js 內建的 sitemap 產生機制：這個檔案 export 出來的內容，
 * build 時會自動變成 /sitemap.xml，讓搜尋引擎知道網站上有哪些頁面。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: post.date,
  }));

  // 標籤是中文字（例如「旅行」），網址裡的中文字要 encode 過才是合法的 URL。
  const tagEntries: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: `${SITE_URL}/tags/${encodeURIComponent(tag)}`,
  }));

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/about` },
    ...postEntries,
    ...tagEntries,
  ];
}

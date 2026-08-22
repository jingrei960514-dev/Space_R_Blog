import { getAllPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * RSS 2.0 是純文字的 XML 格式，不需要額外套件就能自己組字串產生，
 * 這裡手動拼 XML——結構簡單，不值得為了這個再多裝一個套件。
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildItem(post: ReturnType<typeof getAllPosts>[number]): string {
  const url = `${SITE_URL}/posts/${post.slug}`;
  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.summary)}</description>
    </item>`;
}

// 這個 route.ts 讓 /rss.xml 這個網址回傳 XML，而不是一般的 HTML 頁面。
// force-static：內容只跟文章檔案有關、不需要依請求即時運算，跟全站 SSG 方向一致，
// build 時就把 XML 產生好存成靜態檔案。
export const dynamic = "force-static";

export async function GET() {
  const items = getAllPosts().map(buildItem).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-TW</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

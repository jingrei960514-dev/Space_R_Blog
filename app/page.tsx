import Link from "next/link";

/**
 * 階段 1：先用寫死在程式碼裡的假資料撐起首頁結構。
 * 階段 2 會把這份陣列換成「讀取 /content/posts 底下的 Markdown 檔案」的結果，
 * 屆時這裡的資料形狀（title / date / summary / tags）不會變，只是來源從寫死變成讀檔。
 */
const posts = [
  {
    slug: "alishan-sunrise",
    title: "阿里山看日出的那一天",
    date: "2026-08-20",
    summary: "凌晨三點爬起來，只為了那十分鐘。",
    tags: ["旅行", "台灣"],
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <ul className="flex flex-col gap-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`} className="block">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                {post.date}
              </p>
              <p className="mt-2">{post.summary}</p>
              <div className="mt-2 flex gap-2 text-sm text-black/60 dark:text-white/60">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

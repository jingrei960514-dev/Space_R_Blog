import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/**
 * 文章列表元件：首頁（全部文章）跟標籤頁（單一標籤底下的文章）共用同一份排版，
 * 避免同樣的清單樣式在兩個頁面各寫一次。
 *
 * 標籤連結故意放在文章連結外面，不是包在裡面——<Link> 底層會渲染成 <a>，
 * <a> 裡面不能再放另一個 <a>（無效的 HTML），所以標籤要當成獨立的兄弟元素。
 */
export default function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <ul className="flex flex-col gap-8">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/posts/${post.slug}`} className="block">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-1 text-sm text-black/50 dark:text-white/50">
              {post.date}
            </p>
            <p className="mt-2">{post.summary}</p>
          </Link>
          <div className="mt-2 flex gap-2 text-sm text-black/60 dark:text-white/60">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`} className="hover:underline">
                #{tag}
              </Link>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

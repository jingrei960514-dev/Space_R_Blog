import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

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

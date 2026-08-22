import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import PostList from "@/components/PostList";

// build 時幫每個出現過的標籤產生一個靜態頁面。
export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tags/[tag]">) {
  const { tag } = await params;
  return {
    title: `標籤：${tag}`,
    description: `標籤「${tag}」底下的所有文章。`,
  };
}

export default async function TagPage({ params }: PageProps<"/tags/[tag]">) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  // 標籤不存在（沒有任何文章掛這個標籤）—— 導向 404，跟文章頁的處理方式一致。
  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold">標籤：{tag}</h1>
      <div className="mt-8">
        <PostList posts={posts} />
      </div>
    </div>
  );
}

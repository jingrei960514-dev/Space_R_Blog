import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";

// 告訴 Next.js build 時要幫哪些 slug 產生靜態頁面（SSG）。
// 沒列在這裡的 slug，使用者訪問時會走下面 catch 到的 notFound()。
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

// 讓每篇文章的瀏覽器分頁標題顯示文章標題，而不是全站統一的「SPACE R」，
// 並補上分享到社群平台時要用的 Open Graph 資訊（標題、摘要、發布日期、封面圖）。
export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return {
      title: post.title,
      description: post.summary,
      openGraph: {
        type: "article",
        title: post.title,
        description: post.summary,
        publishedTime: post.date,
        tags: post.tags,
        images: post.cover ? [post.cover] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function PostPage({
  params,
}: PageProps<"/posts/[slug]">) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof getPostBySlug>>;
  try {
    post = await getPostBySlug(slug);
  } catch {
    // 檔案不存在（slug 打錯、文章被刪掉了）—— 導向 Next.js 內建的 404 頁面。
    notFound();
  }

  return (
    // 文章欄寬約 36em（CLAUDE.md 中文排版要求），比首頁列表的 max-w-3xl 窄，
    // 避免中文一行太長不好讀。
    <article className="mx-auto max-w-[36em] px-6 py-12">
      {/*
        封面圖是可選欄位（frontmatter 沒寫 cover 就不顯示）。
        用 next/image 而不是 <img>——CLAUDE.md 規定的做法，Next.js 會自動處理
        壓縮、依裝置尺寸出圖、延遲載入。因為圖片來源是字串路徑（不是 import
        近來的本地檔案），Next.js 沒辦法自動讀出原始寬高，所以用 fill 搭配
        固定比例的容器（16:9），讓版面不會因為圖片載入完才跳動。
      */}
      {post.cover && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-2 text-sm text-black/50 dark:text-white/50">
        {post.date}
      </p>

      {/*
        contentHtml 是用 remark/rehype 從我們自己寫的 Markdown 檔案轉出來的，
        不是使用者輸入 —— 這個部落格只有作者一人能寫文章，沒有外部投稿，
        所以直接輸出成 HTML 不會有 XSS 風險。若之後開放留言或投稿，這裡就要重新評估。

        文字級 17–18px、行高 1.8、段落間距 gap-6，都是 CLAUDE.md 中文排版要求——
        中文沒有空格斷詞，需要比英文更寬鬆的行高跟留白才好讀。
      */}
      <div
        className="mt-8 flex flex-col gap-6 text-[17px] leading-[1.8] md:text-[18px] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-black/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-black/5 [&_pre]:p-4 dark:[&_blockquote]:border-white/20 dark:[&_code]:bg-white/10 dark:[&_pre]:bg-white/10"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}

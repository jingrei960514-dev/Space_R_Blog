import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** frontmatter 的型別，對應 CLAUDE.md「文章格式」規定的欄位。 */
export interface PostFrontmatter {
  title: string;
  date: string; // "YYYY-MM-DD"
  tags: string[];
  summary: string;
  cover?: string;
}

/** 文章的 metadata：frontmatter 再加上從檔名推導出的 slug。 */
export type PostMeta = PostFrontmatter & { slug: string };

/** 完整文章：metadata 再加上轉換好的 HTML 內文。 */
export type Post = PostMeta & { contentHtml: string };

/**
 * 列出 /content/posts 底下所有文章的 slug（檔名去掉 .md）。
 * 檔名即網址是 CLAUDE.md 訂的規則，所以這裡直接拿檔名當 slug，不用額外欄位維護。
 */
export function getPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

/**
 * gray-matter 底層用 YAML 解析器讀 frontmatter，YAML 規格會把「沒加引號、長得像日期
 * 的字串」（例如 `date: 2026-08-20`）自動轉成 JavaScript 的 Date 物件，而不是字串。
 * 這裡統一轉回 "YYYY-MM-DD" 字串，避免 React 沒辦法渲染 Date 物件、字串排序比較也失準。
 */
function toDateString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

/**
 * 依 slug 讀取單篇文章的 frontmatter（不轉換內文），文章頁跟首頁列表共用這段邏輯。
 */
function readPostMeta(slug: string): PostMeta {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);
  return {
    slug,
    ...(data as PostFrontmatter),
    date: toDateString(data.date),
  };
}

/**
 * 依 slug 讀取單篇文章，回傳 frontmatter + 轉換好的 HTML 內文。
 * 文章頁（/posts/[slug]）用這個函式。
 *
 * remark/rehype 是一條處理鏈（unified）：
 *   remarkParse   Markdown 字串   → Markdown 語法樹
 *   remarkRehype  Markdown 語法樹 → HTML 語法樹
 *   rehypeStringify  HTML 語法樹  → HTML 字串
 */
export async function getPostBySlug(slug: string): Promise<Post> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processed = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);

  return {
    slug,
    contentHtml: processed.toString(),
    ...(data as PostFrontmatter),
    date: toDateString(data.date),
  };
}

/**
 * 取得所有文章的 metadata，依日期新到舊排序。首頁列表用這個就夠，
 * 不需要把每一篇文章的內文都轉成 HTML（省掉不必要的 Markdown 處理）。
 *
 * 日期用字串直接比較（"2026-08-20" > "2026-08-10"）就能得到正確的新舊順序，
 * 因為 YYYY-MM-DD 格式本身照字母排序就等於照時間排序，不需要轉成 Date 物件。
 */
export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map(readPostMeta)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

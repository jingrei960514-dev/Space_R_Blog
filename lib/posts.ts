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

/** rehype 的語法樹節點，只列出我們會用到的欄位（避免額外安裝 @types/hast）。 */
interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  children?: HastNode[];
}

/**
 * 在中文字與英文字母/數字相鄰的地方補一個半形空格，例如「用了 Git 這麼多年」
 * 而不是「用了Git這麼多年」——CLAUDE.md 中文排版要求的「中英數字混排要留間距」。
 */
function addCjkLatinSpacing(text: string): string {
  // 一-龥 是「CJK 統一表意文字」的 Unicode 範圍，涵蓋常用中文字。
  return text
    .replace(/([一-龥])([A-Za-z0-9])/g, "$1 $2")
    .replace(/([A-Za-z0-9])([一-龥])/g, "$1 $2");
}

/**
 * 走訪 HTML 語法樹，幫文字節點加上中英間距。
 * 程式碼區塊（<pre>/<code>）裡的內容跳過不處理，避免把程式碼語法改壞。
 */
function walkAndSpaceOut(node: HastNode, insideCode: boolean): void {
  const nowInsideCode =
    insideCode || node.tagName === "pre" || node.tagName === "code";

  if (node.type === "text" && node.value && !nowInsideCode) {
    node.value = addCjkLatinSpacing(node.value);
  }

  node.children?.forEach((child) => walkAndSpaceOut(child, nowInsideCode));
}

/** unified 外掛：套用在 remarkRehype 轉出的 HTML 語法樹上。 */
function rehypeCjkLatinSpacing() {
  return (tree: HastNode) => {
    walkAndSpaceOut(tree, false);
  };
}

/**
 * 依 slug 讀取單篇文章，回傳 frontmatter + 轉換好的 HTML 內文。
 * 文章頁（/posts/[slug]）用這個函式。
 *
 * remark/rehype 是一條處理鏈（unified）：
 *   remarkParse         Markdown 字串   → Markdown 語法樹
 *   remarkRehype        Markdown 語法樹 → HTML 語法樹
 *   rehypeCjkLatinSpacing  在 HTML 語法樹上補中英間距
 *   rehypeStringify      HTML 語法樹    → HTML 字串
 */
export async function getPostBySlug(slug: string): Promise<Post> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processed = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCjkLatinSpacing)
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

/**
 * 取得所有文章用過的標籤（不重複），給標籤頁的 generateStaticParams 用，
 * 決定 build 時要產生哪些 /tags/[tag] 靜態頁面。
 */
export function getAllTags(): string[] {
  const tags = getAllPosts().flatMap((post) => post.tags);
  return Array.from(new Set(tags));
}

/**
 * 取得帶有某個標籤的所有文章，依日期新到舊排序（沿用 getAllPosts 的排序）。
 * 標籤頁 /tags/[tag] 用這個取得列表內容。
 */
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // 關閉 Next.js 自動寫入 AGENTS.md / CLAUDE.md 的功能。
  // 這個專案的 CLAUDE.md 是作者自己維護的規格文件，不希望被 `next dev` 自動追加內容。
  agentRules: false,
};

export default nextConfig;

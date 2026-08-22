# SPACE R

個人部落格。專案規格與開發規則都寫在 [`CLAUDE.md`](./CLAUDE.md)，請先讀那份文件。

## 開發

```bash
npm install
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000) 查看結果。

## 新增文章

在 `content/posts/` 底下新增一個 `.md` 檔即可，檔名規則跟 frontmatter 格式
詳見 [`CLAUDE.md`](./CLAUDE.md) 的「文章格式」章節。存檔後 `npm run dev`
會自動重新整理；正式站則是 push 上去、Vercel 自動重新 build。

## SEO / sitemap / RSS

這幾個是 build 時自動產生的檔案，不用手動維護：

- `/sitemap.xml` —— `app/sitemap.ts`，列出全站所有頁面（首頁、關於、每篇
  文章、每個標籤頁），給搜尋引擎爬蟲用
- `/robots.txt` —— `app/robots.ts`，全站開放索引，並指向 sitemap
- `/rss.xml` —— `app/rss.xml/route.ts`，訂閱用的 RSS 2.0 feed，內容來自
  `getAllPosts()`

三者跟頁面的 `<meta>` 標籤（Open Graph、標題模板等）共用同一份網站資訊，
定義在 `lib/site.ts`。

## 部署（Vercel）

1. 把這個 repo push 到 GitHub（目前還沒設定 remote，第一次部署前記得先建
   一個 GitHub repo 並 push 上去）。
2. 到 [vercel.com](https://vercel.com) 用同一個 GitHub 帳號登入，選
   **Add New → Project**，匯入這個 repo。Vercel 會自動偵測到 Next.js，
   Build Command / Output 都不用改，直接 Deploy。
3. **第一次 deploy 完成後**，把 Vercel 配的網址（或你接的自訂網域）填進
   **Project Settings → Environment Variables**，新增：
   ```
   NEXT_PUBLIC_SITE_URL=https://你的網域
   ```
   這個變數是給 sitemap、RSS、Open Graph 連結組「完整網址」用的（沒設定
   的話會退回 `http://localhost:3000`，正式站不能用這個）。存完設定要
   手動觸發一次 **Redeploy** 才會生效。
4. 之後每次 `git push`（或合併到部署分支），Vercel 都會自動重新
   build/deploy，不需要手動操作。

沒有資料庫、沒有後台，新增文章就是「寫 `.md` 檔 → commit → push」。

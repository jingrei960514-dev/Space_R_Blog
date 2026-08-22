---
title: 重新學 Git 分支的心得
date: 2026-08-10
tags: [學習]
summary: 用了好幾年 Git，這次才真的搞懂分支背後在幹嘛。
---

用 Git 這麼多年，一直都是靠背指令活下去，直到最近才靜下心把分支模型搞懂。

## 學到的幾個重點

- 分支只是一個指向某個 commit 的「指標」，本身很輕量
- `git merge` 跟 `git rebase` 解決的是同一個問題，但留下的歷史紀錄長得不一樣
- 沒事不要對已經推上共用分支的 commit 做 rebase

> 想真正理解 Git，最快的方法是自己畫一次 commit graph，而不是死背指令。

日常最常用到的指令大概就是這幾行：

```bash
git switch -c feature/new-page
git add .
git commit -m "新增頁面"
git push -u origin feature/new-page
```

如果想更深入，[Pro Git](https://git-scm.com/book) 這本書的分支章節寫得很清楚，值得找時間讀完。

# GitHub 上傳與 Vercel 部署完整指南

## 📋 部署流程概覽

1. **準備 Git 倉庫** → 2. **上傳到 GitHub** → 3. **連接 Vercel** → 4. **自動部署**

---

## 🚀 第一步：準備 Git 倉庫

### 1.1 初始化 Git（如果還沒有）
```bash
# 在專案根目錄執行
git init
```

### 1.2 創建 .gitignore 文件
```bash
# 如果還沒有 .gitignore，創建一個
touch .gitignore
```

在 `.gitignore` 中添加以下內容：
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
.next/
out/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE and editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/
.nyc_output/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/

# Local development files
*.local

# Test files
__tests__/
*.test.js
*.test.ts
*.spec.js
*.spec.ts

# Vercel
.vercel
```

### 1.3 添加所有文件到 Git
```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: ResumeCraft project setup"
```

---

## 🌐 第二步：上傳到 GitHub

### 2.1 在 GitHub 創建新倉庫

1. 訪問 [github.com](https://github.com)
2. 點擊右上角的 "+" 按鈕
3. 選擇 "New repository"
4. 填寫倉庫信息：
   - **Repository name**: `resumecraft` 或您喜歡的名稱
   - **Description**: `Professional Resume Builder - ResumeCraft`
   - **Visibility**: 選擇 Public 或 Private
   - **不要**勾選 "Add a README file"（因為我們已經有文件了）
   - **不要**勾選 "Add .gitignore"（我們已經有了）
   - **不要**勾選 "Choose a license"

5. 點擊 "Create repository"

### 2.2 連接本地倉庫到 GitHub

GitHub 會顯示連接指令，類似這樣：

```bash
# 添加遠程倉庫（替換 YOUR_USERNAME 和 YOUR_REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 設置主分支名稱
git branch -M main

# 推送代碼到 GitHub
git push -u origin main
```

### 2.3 實際執行命令
```bash
# 替換成您的實際 GitHub 用戶名和倉庫名
git remote add origin https://github.com/YOUR_USERNAME/resumecraft.git
git branch -M main
git push -u origin main
```

---

## ⚡ 第三步：部署到 Vercel

### 3.1 通過 Vercel Dashboard 部署（推薦）

1. **訪問 Vercel**
   - 前往 [vercel.com](https://vercel.com)
   - 點擊 "Sign up" 或 "Log in"
   - 使用 GitHub 帳號登入

2. **導入專案**
   - 點擊 "New Project"
   - 在 "Import Git Repository" 中找到您的 `resumecraft` 倉庫
   - 點擊 "Import"

3. **配置專案設定**
   - **Project Name**: `resumecraft`（或您喜歡的名稱）
   - **Framework Preset**: `Next.js`（應該自動檢測到）
   - **Root Directory**: `./`（保持預設）
   - **Build Command**: `npm run build`（保持預設）
   - **Output Directory**: `.next`（保持預設）
   - **Install Command**: `npm install`（保持預設）

4. **環境變數配置**
   - 點擊 "Environment Variables"
   - 添加以下變數：
   ```
   NODE_ENV = production
   NEXT_PUBLIC_APP_URL = https://your-project-name.vercel.app
   ```

5. **部署**
   - 點擊 "Deploy"
   - 等待部署完成（通常 2-5 分鐘）

### 3.2 通過 Vercel CLI 部署（可選）

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入 Vercel
vercel login

# 在專案目錄中部署
vercel

# 生產環境部署
vercel --prod
```

---

## 🔧 第四步：配置自動部署

### 4.1 自動部署設定
- Vercel 會自動監聽 GitHub 倉庫的更改
- 每次推送代碼到 `main` 分支時，Vercel 會自動重新部署

### 4.2 部署預覽
- 每次 Pull Request 都會創建預覽部署
- 可以在 Vercel Dashboard 中查看所有部署

---

## 📝 第五步：後續更新流程

### 5.1 更新代碼流程
```bash
# 1. 修改代碼後，添加更改
git add .

# 2. 提交更改
git commit -m "描述您的更改"

# 3. 推送到 GitHub
git push origin main

# 4. Vercel 會自動部署新版本
```

### 5.2 查看部署狀態
- 在 Vercel Dashboard 中查看部署歷史
- 檢查部署日誌和錯誤信息

---

## 🎯 部署後檢查清單

### 功能測試
- [ ] 首頁正常載入
- [ ] 履歷編輯器功能正常
- [ ] PDF 匯出功能正常
- [ ] 後台管理系統正常
- [ ] 公告系統正常
- [ ] 通知系統正常
- [ ] 意見回饋功能正常

### 效能檢查
- [ ] 頁面載入速度
- [ ] 行動裝置適配
- [ ] 圖片優化效果

---

## 🚨 常見問題解決

### 問題 1：Git 推送失敗
```bash
# 檢查遠程倉庫設定
git remote -v

# 重新設定遠程倉庫
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 問題 2：Vercel 部署失敗
- 檢查 `package.json` 中的腳本
- 確認所有依賴都已安裝
- 查看 Vercel 部署日誌

### 問題 3：環境變數問題
- 在 Vercel Dashboard 中重新配置環境變數
- 確保變數名稱正確

---

## 🎉 完成！

部署完成後，您將獲得：
- **生產環境 URL**: `https://your-project-name.vercel.app`
- **自動部署**: 每次推送代碼都會自動部署
- **全球 CDN**: 快速全球訪問
- **HTTPS**: 自動 SSL 證書

---

## 📞 需要幫助？

如果遇到問題，可以：
1. 查看 Vercel 部署日誌
2. 檢查 GitHub Actions（如果啟用）
3. 參考 [Vercel 文檔](https://vercel.com/docs)
4. 查看 [Next.js 部署指南](https://nextjs.org/docs/deployment)

**祝您部署成功！** 🚀

# ResumeCraft Vercel 部署指南

## 🚀 部署步驟

### 1. 準備工作
確保您的專案已經完成以下準備：
- ✅ 所有功能測試完成
- ✅ 代碼已提交到 Git 倉庫
- ✅ 環境變數已配置

### 2. Vercel 部署

#### 方法一：通過 Vercel CLI
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入 Vercel
vercel login

# 部署專案
vercel

# 生產環境部署
vercel --prod
```

#### 方法二：通過 Vercel Dashboard
1. 訪問 [vercel.com](https://vercel.com)
2. 點擊 "New Project"
3. 連接您的 Git 倉庫
4. 配置專案設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. 環境變數配置

在 Vercel Dashboard 中配置以下環境變數：

#### 必要環境變數
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### 可選環境變數（如果需要郵件功能）
```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
```

### 4. 部署配置說明

#### vercel.json 配置
- **functions**: API 路由最大執行時間設定為 30 秒
- **headers**: 安全標頭配置
- **rewrites**: URL 重寫規則
- **redirects**: 重定向規則

#### 優化設定
- **圖片優化**: 支援 WebP 和 AVIF 格式
- **代碼分割**: 自動優化打包
- **快取策略**: 靜態資源快取優化

### 5. 部署後檢查

#### 功能測試清單
- [ ] 首頁正常載入
- [ ] 履歷編輯器功能正常
- [ ] PDF 匯出功能正常
- [ ] 後台管理系統正常
- [ ] 公告系統正常
- [ ] 通知系統正常
- [ ] 意見回饋功能正常

#### 效能檢查
- [ ] 頁面載入速度
- [ ] 圖片優化效果
- [ ] API 響應時間
- [ ] 行動裝置適配

### 6. 域名配置（可選）

如果需要自定義域名：
1. 在 Vercel Dashboard 中進入專案設定
2. 點擊 "Domains"
3. 添加您的域名
4. 配置 DNS 記錄

### 7. 監控和分析

#### Vercel Analytics
- 啟用 Vercel Analytics 監控網站效能
- 查看頁面載入時間和用戶行為

#### 錯誤監控
- 檢查 Vercel Functions 日誌
- 監控 API 錯誤率

## 🔧 故障排除

### 常見問題

#### 1. 構建失敗
```bash
# 檢查 Node.js 版本
node --version

# 清理快取
rm -rf .next node_modules
npm install
npm run build
```

#### 2. API 路由問題
- 檢查 API 路由是否正確導出
- 確認環境變數配置
- 查看 Vercel Functions 日誌

#### 3. 圖片載入問題
- 確認圖片域名已添加到 `next.config.js`
- 檢查圖片路徑是否正確

### 支援資源
- [Vercel 文檔](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Vercel 社群](https://github.com/vercel/vercel/discussions)

## 📝 部署檢查清單

- [ ] 代碼已提交到 Git
- [ ] 環境變數已配置
- [ ] 構建測試通過
- [ ] 功能測試完成
- [ ] 域名配置（如需要）
- [ ] 監控設定完成

---

🎉 **部署完成後，您的 ResumeCraft 就可以在線使用了！**

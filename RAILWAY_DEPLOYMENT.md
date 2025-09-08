# ResumeCraft Railway 部署指南

## 🚀 部署步驟

### 1. 準備 GitHub 倉庫
```bash
# 在專案根目錄執行
git add .
git commit -m "準備 Railway 部署"
git remote add origin https://github.com/Kevin42127/Resumecraft-2025.git
git push -u origin main
```

### 2. 安裝 Railway CLI
```bash
npm install -g @railway/cli
```

### 3. 登入 Railway
```bash
railway login
```

### 4. 初始化專案
```bash
railway init
```

### 5. 設定環境變數
```bash
railway variables set NODE_ENV=production
railway variables set NEXT_PUBLIC_USE_BACKEND_PDF=true
railway variables set PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### 6. 部署
```bash
railway up
```

## 📋 環境變數說明

| 變數名 | 值 | 說明 |
|--------|-----|------|
| NODE_ENV | production | 生產環境 |
| NEXT_PUBLIC_USE_BACKEND_PDF | true | 啟用後端 PDF 生成 |
| PUPPETEER_EXECUTABLE_PATH | /usr/bin/chromium-browser | Chrome 執行路徑 |

## 🔧 部署後檢查

1. 訪問你的 Railway 應用 URL
2. 測試前端 PDF 生成功能
3. 測試後端 PDF 生成功能
4. 檢查降級機制是否正常

## 🐛 常見問題

### Puppeteer 啟動失敗
- 檢查環境變數 `PUPPETEER_EXECUTABLE_PATH`
- 確認 Railway 支援 Chrome 環境

### PDF 生成超時
- 檢查 `timeout` 設定
- 確認 HTML 內容大小

### 記憶體不足
- 檢查 Puppeteer 參數配置
- 考慮優化 HTML 內容

## 📞 支援

如果遇到問題，請檢查：
1. Railway 部署日誌
2. 應用程式日誌
3. 環境變數設定

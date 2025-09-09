# ResumeCraft Docker 部署指南

本指南將幫助你使用 Docker 部署 ResumeCraft 專案。

## 📋 前置需求

- Docker Desktop (Windows/Mac) 或 Docker Engine (Linux)
- Docker Compose
- 至少 2GB 可用記憶體

## 🚀 快速開始

### 1. 環境配置

複製環境變數範例文件：
```bash
cp env.example .env
```

編輯 `.env` 文件，填入你的配置：
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NEXT_PUBLIC_CSHARP_PDF_API=http://localhost:5000/generate-pdf
```

### 2. 部署方式

#### 方式一：使用部署腳本（推薦）

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh prod
```

**Windows:**
```cmd
deploy.bat prod
```

#### 方式二：手動部署

```bash
# 建構映像
docker-compose build

# 啟動服務
docker-compose up -d

# 檢查狀態
docker-compose ps
```

## 📁 文件說明

### 核心文件

- `Dockerfile` - Docker 映像建構配置
- `docker-compose.yml` - 服務編排配置
- `.dockerignore` - Docker 建構忽略文件
- `env.example` - 環境變數範例

### 部署腳本

- `deploy.sh` - Linux/Mac 部署腳本
- `deploy.bat` - Windows 部署腳本

## 🔧 配置選項

### 環境變數

| 變數名 | 說明 | 預設值 |
|--------|------|--------|
| `EMAIL_USER` | 郵件服務用戶名 | - |
| `EMAIL_PASS` | 郵件服務密碼 | - |
| `NEXT_PUBLIC_CSHARP_PDF_API` | PDF 生成服務 URL | `http://localhost:5000/generate-pdf` |
| `NODE_ENV` | 運行環境 | `production` |

### 端口配置

- 主應用：`3000`
- PDF 服務（可選）：`5000`

## 📊 服務管理

### 查看服務狀態
```bash
docker-compose ps
```

### 查看日誌
```bash
docker-compose logs -f resumecraft
```

### 重啟服務
```bash
docker-compose restart resumecraft
```

### 停止服務
```bash
docker-compose down
```

### 清理環境
```bash
docker-compose down --remove-orphans
docker system prune -f
```

## 🐛 故障排除

### 常見問題

1. **服務無法啟動**
   - 檢查端口 3000 是否被占用
   - 確認環境變數配置正確
   - 查看容器日誌：`docker-compose logs resumecraft`

2. **PDF 生成失敗**
   - 確認 Puppeteer 依賴正確安裝
   - 檢查 Chromium 是否可用
   - 查看瀏覽器控制台錯誤

3. **郵件發送失敗**
   - 確認 EMAIL_USER 和 EMAIL_PASS 配置正確
   - 檢查 Gmail 應用程式密碼設定
   - 測試郵件配置：訪問 `/api/test-email`

### 健康檢查

服務包含健康檢查端點：
- 健康狀態：`http://localhost:3000/api/email-status`
- 測試郵件：`http://localhost:3000/api/test-email`

## 🔒 安全建議

1. **環境變數安全**
   - 不要在代碼中硬編碼敏感信息
   - 使用 `.env` 文件管理環境變數
   - 確保 `.env` 文件在版本控制中被忽略

2. **容器安全**
   - 使用非 root 用戶運行應用
   - 定期更新基礎映像
   - 限制容器資源使用

3. **網路安全**
   - 使用 HTTPS（生產環境）
   - 配置防火牆規則
   - 限制不必要的端口暴露

## 📈 效能優化

### 映像優化
- 使用多階段建構減少映像大小
- 利用 Next.js standalone 輸出
- 排除不必要的文件

### 運行時優化
- 設定適當的記憶體限制
- 使用健康檢查監控服務狀態
- 配置日誌輪轉

## 🌐 生產部署

### 雲端平台部署

#### Railway
```bash
# 安裝 Railway CLI
npm install -g @railway/cli

# 登入並部署
railway login
railway deploy
```

#### Docker Hub
```bash
# 建構並推送映像
docker build -t your-username/resumecraft .
docker push your-username/resumecraft
```

### 自建伺服器

1. 確保伺服器安裝 Docker 和 Docker Compose
2. 上傳專案文件到伺服器
3. 配置環境變數
4. 執行部署腳本

## 📝 維護指南

### 定期維護
- 更新依賴套件
- 清理未使用的映像和容器
- 監控服務日誌
- 備份數據文件

### 更新部署
```bash
# 拉取最新代碼
git pull

# 重新建構並部署
./deploy.sh prod
```

## 🆘 支援

如果遇到問題，請：
1. 檢查本文檔的故障排除部分
2. 查看服務日誌
3. 確認環境配置
4. 聯繫技術支援

---

**注意：** 本部署配置已針對 ResumeCraft 專案進行優化，包含 Puppeteer 支援和數據持久化配置。

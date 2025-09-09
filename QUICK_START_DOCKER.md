# 🚀 ResumeCraft Docker 快速開始

## 1️⃣ 準備環境

```bash
# 複製環境變數文件
cp env.example .env

# 編輯 .env 文件，填入你的配置
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
```

## 2️⃣ 部署應用

### Windows 用戶
```cmd
deploy.bat prod
```

### Linux/Mac 用戶
```bash
chmod +x deploy.sh
./deploy.sh prod
```

### 手動部署
```bash
docker-compose build
docker-compose up -d
```

## 3️⃣ 驗證部署

訪問 http://localhost:3000 查看應用

## 4️⃣ 常用命令

```bash
# 查看服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f resumecraft

# 停止服務
docker-compose down

# 清理環境
docker-compose down --remove-orphans
docker system prune -f
```

## 📚 詳細文檔

查看 `DOCKER_DEPLOYMENT.md` 獲取完整的部署指南。

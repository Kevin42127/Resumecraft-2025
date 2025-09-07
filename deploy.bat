@echo off
echo ========================================
echo    ResumeCraft GitHub + Vercel 部署
echo ========================================
echo.

echo 步驟 1: 檢查 Git 狀態
git status
echo.

echo 步驟 2: 請按照以下步驟操作：
echo.
echo 1. 前往 https://github.com
echo 2. 點擊右上角的 "+" 按鈕
echo 3. 選擇 "New repository"
echo 4. 填寫倉庫信息：
echo    - Repository name: resumecraft
echo    - Description: Professional Resume Builder - ResumeCraft
echo    - 選擇 Public 或 Private
echo    - 不要勾選任何選項
echo 5. 點擊 "Create repository"
echo.

echo 步驟 3: 複製您的 GitHub 倉庫 URL，然後執行以下命令：
echo.
echo git remote add origin https://github.com/YOUR_USERNAME/resumecraft.git
echo git branch -M main
echo git push -u origin main
echo.

echo 步驟 4: 部署到 Vercel
echo 1. 前往 https://vercel.com
echo 2. 使用 GitHub 帳號登入
echo 3. 點擊 "New Project"
echo 4. 選擇您的 resumecraft 倉庫
echo 5. 點擊 "Import"
echo 6. 配置環境變數：
echo    - NODE_ENV = production
echo    - NEXT_PUBLIC_APP_URL = https://your-project-name.vercel.app
echo 7. 點擊 "Deploy"
echo.

echo 部署完成後，您將獲得一個 Vercel 網址！
echo 例如：https://resumecraft-abc123.vercel.app
echo.

pause

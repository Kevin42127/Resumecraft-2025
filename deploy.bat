@echo off
setlocal enabledelayedexpansion

REM ResumeCraft Docker 部署腳本 (Windows)
REM 使用方法: deploy.bat [dev^|prod]

echo 🚀 ResumeCraft Docker 部署腳本

REM 檢查 Docker 是否安裝
docker --version >nul 2>&1
if errorlevel 1 (
    echo 錯誤: Docker 未安裝，請先安裝 Docker Desktop
    pause
    exit /b 1
)

REM 檢查 docker-compose 是否安裝
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo 錯誤: docker-compose 未安裝，請先安裝 docker-compose
    pause
    exit /b 1
)

REM 檢查環境變數文件
if not exist ".env" (
    echo 警告: .env 文件不存在
    if exist "env.example" (
        copy env.example .env
        echo 已創建 .env 文件，請編輯其中的配置
    ) else (
        echo 請創建 .env 文件並填入正確的環境變數
    )
)

REM 處理命令行參數
set MODE=%1
if "%MODE%"=="" set MODE=prod

if "%MODE%"=="dev" (
    echo 開發模式部署
    set NODE_ENV=development
    goto :deploy
) else if "%MODE%"=="prod" (
    echo 生產模式部署
    set NODE_ENV=production
    goto :deploy
) else if "%MODE%"=="clean" (
    goto :clean
) else if "%MODE%"=="logs" (
    goto :logs
) else if "%MODE%"=="status" (
    goto :status
) else if "%MODE%"=="help" (
    goto :help
) else (
    echo 未知選項: %MODE%
    goto :help
)

:deploy
echo 清理舊的容器和映像...
docker-compose down --remove-orphans
docker system prune -f

echo 建構 Docker 映像...
docker-compose build --no-cache

echo 啟動服務...
docker-compose up -d

echo 檢查服務狀態...
docker-compose ps

echo 等待服務啟動...
timeout /t 10 /nobreak >nul

echo ✅ 部署完成！服務運行在 http://localhost:3000
goto :end

:clean
echo 清理所有容器和映像...
docker-compose down --remove-orphans
docker system prune -f
echo ✅ 清理完成
goto :end

:logs
echo 顯示服務日誌...
docker-compose logs -f --tail=50 resumecraft
goto :end

:status
echo 檢查服務狀態...
docker-compose ps
goto :end

:help
echo ResumeCraft Docker 部署腳本
echo.
echo 使用方法:
echo   deploy.bat [選項]
echo.
echo 選項:
echo   dev     開發模式部署
echo   prod    生產模式部署
echo   clean   清理所有容器和映像
echo   logs    顯示服務日誌
echo   status  檢查服務狀態
echo   help    顯示此說明
echo.
echo 範例:
echo   deploy.bat prod    # 生產模式部署
echo   deploy.bat clean   # 清理環境
echo   deploy.bat logs    # 查看日誌
goto :end

:end
pause

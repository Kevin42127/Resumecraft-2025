#!/bin/bash

# ResumeCraft Docker 部署腳本
# 使用方法: ./deploy.sh [dev|prod]

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函數：打印彩色訊息
print_message() {
    echo -e "${2}${1}${NC}"
}

# 函數：檢查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_message "錯誤: $1 未安裝，請先安裝 $1" $RED
        exit 1
    fi
}

# 函數：檢查環境變數文件
check_env_file() {
    if [ ! -f ".env" ]; then
        print_message "警告: .env 文件不存在" $YELLOW
        print_message "請複製 env.example 到 .env 並填入正確的環境變數" $YELLOW
        if [ -f "env.example" ]; then
            cp env.example .env
            print_message "已創建 .env 文件，請編輯其中的配置" $GREEN
        fi
    fi
}

# 函數：清理舊的容器和映像
cleanup() {
    print_message "清理舊的容器和映像..." $BLUE
    docker-compose down --remove-orphans || true
    docker system prune -f || true
}

# 函數：建構映像
build_image() {
    print_message "建構 Docker 映像..." $BLUE
    docker-compose build --no-cache
}

# 函數：啟動服務
start_services() {
    print_message "啟動服務..." $BLUE
    docker-compose up -d
}

# 函數：檢查服務狀態
check_services() {
    print_message "檢查服務狀態..." $BLUE
    docker-compose ps
    
    # 等待服務啟動
    print_message "等待服務啟動..." $YELLOW
    sleep 10
    
    # 檢查健康狀態
    if docker-compose ps | grep -q "healthy"; then
        print_message "✅ 服務運行正常" $GREEN
    else
        print_message "⚠️  服務可能還在啟動中，請稍後檢查" $YELLOW
    fi
}

# 函數：顯示日誌
show_logs() {
    print_message "顯示服務日誌..." $BLUE
    docker-compose logs -f --tail=50 resumecraft
}

# 函數：顯示使用說明
show_help() {
    echo "ResumeCraft Docker 部署腳本"
    echo ""
    echo "使用方法:"
    echo "  ./deploy.sh [選項]"
    echo ""
    echo "選項:"
    echo "  dev     開發模式部署"
    echo "  prod    生產模式部署"
    echo "  clean   清理所有容器和映像"
    echo "  logs    顯示服務日誌"
    echo "  status  檢查服務狀態"
    echo "  help    顯示此說明"
    echo ""
    echo "範例:"
    echo "  ./deploy.sh prod    # 生產模式部署"
    echo "  ./deploy.sh clean   # 清理環境"
    echo "  ./deploy.sh logs    # 查看日誌"
}

# 主程式
main() {
    print_message "🚀 ResumeCraft Docker 部署腳本" $GREEN
    
    # 檢查必要命令
    check_command docker
    check_command docker-compose
    
    # 檢查環境變數文件
    check_env_file
    
    case "${1:-prod}" in
        "dev")
            print_message "開發模式部署" $YELLOW
            export NODE_ENV=development
            cleanup
            build_image
            start_services
            check_services
            ;;
        "prod")
            print_message "生產模式部署" $GREEN
            export NODE_ENV=production
            cleanup
            build_image
            start_services
            check_services
            ;;
        "clean")
            cleanup
            print_message "清理完成" $GREEN
            ;;
        "logs")
            show_logs
            ;;
        "status")
            docker-compose ps
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_message "未知選項: $1" $RED
            show_help
            exit 1
            ;;
    esac
}

# 執行主程式
main "$@"

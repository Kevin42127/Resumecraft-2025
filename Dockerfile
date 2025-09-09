# 使用官方 Node.js 18 Alpine 映像作為基礎
FROM node:18-alpine AS base

# 安裝系統依賴（包括 Puppeteer 需要的 Chromium）
RUN apk add --no-cache libc6-compat chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont font-noto-cjk

# 設定 Puppeteer 環境變數
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# 安裝依賴階段
FROM base AS deps
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

# 建構階段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 設定環境變數
ENV NEXT_TELEMETRY_DISABLED=1

# 建構應用程式
RUN npm run build

# 生產階段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# 創建非 root 使用者
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 複製建構產物
COPY --from=builder /app/public ./public

# 設定正確的權限並複製 standalone 輸出
RUN mkdir .next && chown nextjs:nodejs .next

# 自動利用輸出追蹤來減少映像大小
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 創建數據目錄並設定權限
RUN mkdir -p data && chown nextjs:nodejs data

USER nextjs

EXPOSE 3000

ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

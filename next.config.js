/** @type {import('next').NextConfig} */
const nextConfig = {
  // 效能優化設定
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // 輸出設定
  output: 'standalone',
  
  // 圖片優化
  images: {
    domains: ['localhost', 'vercel.app'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    unoptimized: false,
  },
  
  // 實驗性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Webpack 優化
  webpack: (config, { dev, isServer }) => {
    // 排除 puppeteer（僅在伺服器端需要）
    if (isServer) {
      config.externals.push({
        'puppeteer': 'commonjs puppeteer'
      })
    }
    
    // 開發模式優化
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    
    // 生產模式優化
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    }
    
    return config
  },
}

module.exports = nextConfig

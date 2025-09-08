// 簡單的 Service Worker 避免 404 錯誤
// 目前不提供離線功能，僅作為佔位符

const CACHE_NAME = 'resumecraft-v1'

// 安裝事件
self.addEventListener('install', (event) => {
  console.log('Service Worker 已安裝')
  self.skipWaiting()
})

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('Service Worker 已激活')
  event.waitUntil(self.clients.claim())
})

// 攔截請求
self.addEventListener('fetch', (event) => {
  // 目前不提供緩存功能，直接通過網路請求
  return
})

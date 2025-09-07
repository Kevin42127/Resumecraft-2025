// 開發者功能測試腳本
// 在瀏覽器控制台中運行此腳本來測試開發者功能

console.log('🧪 開始測試開發者功能...')

// 測試1: 身份驗證
async function testAuthentication() {
  console.log('📝 測試1: 身份驗證')
  
  try {
    const response = await fetch('/api/forum/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: 'dev-token-2024' }),
    })
    
    if (response.ok) {
      const auth = await response.json()
      console.log('✅ 身份驗證成功:', auth)
      return auth
    } else {
      const error = await response.json()
      console.log('❌ 身份驗證失敗:', error)
      return null
    }
  } catch (error) {
    console.log('❌ 身份驗證錯誤:', error)
    return null
  }
}

// 測試2: 獲取統計數據
async function testStats(auth) {
  console.log('📊 測試2: 獲取統計數據')
  
  try {
    const response = await fetch('/api/forum/admin/stats', {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    })
    
    if (response.ok) {
      const stats = await response.json()
      console.log('✅ 統計數據獲取成功:', stats)
      return stats
    } else {
      const error = await response.json()
      console.log('❌ 統計數據獲取失敗:', error)
      return null
    }
  } catch (error) {
    console.log('❌ 統計數據獲取錯誤:', error)
    return null
  }
}

// 測試3: 創建測試討論
async function createTestPost() {
  console.log('📝 測試3: 創建測試討論')
  
  try {
    const response = await fetch('/api/forum/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '開發者功能測試討論',
        content: '這是一個用於測試開發者功能的討論。',
        author: '測試用戶',
        category: 'general'
      }),
    })
    
    if (response.ok) {
      const post = await response.json()
      console.log('✅ 測試討論創建成功:', post)
      return post
    } else {
      const error = await response.json()
      console.log('❌ 測試討論創建失敗:', error)
      return null
    }
  } catch (error) {
    console.log('❌ 測試討論創建錯誤:', error)
    return null
  }
}

// 測試4: 刪除討論
async function testDeletePost(auth, postId) {
  console.log('🗑️ 測試4: 刪除討論')
  
  try {
    const response = await fetch(`/api/forum/admin/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ reason: '測試刪除' }),
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ 討論刪除成功:', result)
      return true
    } else {
      const error = await response.json()
      console.log('❌ 討論刪除失敗:', error)
      return false
    }
  } catch (error) {
    console.log('❌ 討論刪除錯誤:', error)
    return false
  }
}

// 測試5: 恢復討論
async function testRestorePost(auth, postId) {
  console.log('🔄 測試5: 恢復討論')
  
  try {
    const response = await fetch(`/api/forum/admin/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
      },
      body: JSON.stringify({}),
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ 討論恢復成功:', result)
      return true
    } else {
      const error = await response.json()
      console.log('❌ 討論恢復失敗:', error)
      return false
    }
  } catch (error) {
    console.log('❌ 討論恢復錯誤:', error)
    return false
  }
}

// 執行所有測試
async function runAllTests() {
  console.log('🚀 開始執行所有測試...')
  
  // 測試1: 身份驗證
  const auth = await testAuthentication()
  if (!auth) {
    console.log('❌ 身份驗證失敗，停止測試')
    return
  }
  
  // 測試2: 獲取統計數據
  await testStats(auth)
  
  // 測試3: 創建測試討論
  const testPost = await createTestPost()
  if (!testPost) {
    console.log('❌ 測試討論創建失敗，跳過刪除和恢復測試')
    return
  }
  
  // 等待一下讓討論創建完成
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 測試4: 刪除討論
  const deleteSuccess = await testDeletePost(auth, testPost.id)
  
  if (deleteSuccess) {
    // 等待一下讓刪除完成
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 測試5: 恢復討論
    await testRestorePost(auth, testPost.id)
  }
  
  console.log('🎉 所有測試完成！')
}

// 導出測試函數供手動調用
window.testDeveloperFeatures = {
  runAllTests,
  testAuthentication,
  testStats,
  createTestPost,
  testDeletePost,
  testRestorePost
}

console.log('📋 測試函數已準備就緒，可以運行以下命令：')
console.log('window.testDeveloperFeatures.runAllTests() - 運行所有測試')
console.log('window.testDeveloperFeatures.testAuthentication() - 測試身份驗證')
console.log('window.testDeveloperFeatures.testStats(auth) - 測試統計數據') 
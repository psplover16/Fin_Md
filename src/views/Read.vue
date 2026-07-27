<template>
  <div class="read-container">
    <div class="nav">
      <router-link to="/">← 回首頁</router-link>
    </div>
    
    <div v-if="loading">文章載入中...</div>
    <div v-else-if="error">找不到文章，請確認 public/md/ 資料夾下是否有對應的 .md 檔案。</div>
    
    <!-- v-html 渲染轉譯後的 HTML -->
    <div v-else class="markdown-body" v-html="htmlContent"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import hljs from 'highlight.js'
// 引入程式碼高亮的主題 CSS (你也可以改成 atom-one-dark.css 等其他主題)
import 'highlight.js/styles/github-dark.css'

const route = useRoute()
const htmlContent = ref('')
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  const articleId = route.params.id
  try {
    // 從 public/md/ 抓取對應的檔案
    const response = await fetch(`/md/${articleId}.md`)
    if (!response.ok) throw new Error('Not Found')
    
    const mdText = await response.text()
    // 將 Markdown 轉為 HTML
    htmlContent.value = marked(mdText)
    
    // 等待 Vue 將 HTML 渲染到畫面上後，觸發 highlight.js 幫程式碼上色
    await nextTick()
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style>
/* 【關鍵】保證不破版的核心 CSS */
.read-container {
  max-width: 800px; /* 限制最大寬度，閱讀體驗較佳 */
  margin: 0 auto;
  padding: 20px;
}
.nav {
  margin-bottom: 20px;
}

.markdown-body {
  width: 100%;
  /* 處理長英文、長網址強制換行，避免撐破容器 */
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.markdown-body img, 
.markdown-body video {
  /* 確保圖片與影片最大寬度不超過容器，且等比例縮放 */
  max-width: 100%;
  height: auto;
  display: block; /* 避免圖片下方出現幽靈空白 */
  margin: 10px 0;
}

.markdown-body pre {
  /* 讓程式碼區塊可以水平滾動，而不是把整個網頁撐開 */
  overflow-x: auto;
  padding: 15px;
  border-radius: 8px;
  background-color: #0d1117; 
  /* 新增：設定預設文字為純白 */
  color: #ffffff;
}

.markdown-body pre code.hljs {
  color: #ffffff;
}
</style>
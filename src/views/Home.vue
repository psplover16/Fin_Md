<template>
  <div class="home-container">
    <h1>文章列表</h1>
    <ul>
      <!-- 這裡的 'test' 對應 public/md/test.md -->
      <li>
        <router-link to="/read/basicComputer">計算機概論</router-link>      
      </li>
      <li>
        <router-link to="/read/digitalLogic">數位邏輯</router-link>  
      </li>
    </ul>
  </div>
</template>

<style>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
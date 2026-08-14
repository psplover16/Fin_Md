<template>
  <div class="home-container">
    <h1>文章列表</h1>
    <ul>
      <!-- 這裡的 'test' 對應 public/md/test.md -->
      <li>
        <router-link to="/read/basicComputer">計算機概論</router-link>      
      </li>
      <li>
        <router-link to="/read/basicComputer_page_frame">計算機概論-分頁與分段</router-link>      
      </li>
    </ul>
    <ul>
      <li>
        <router-link to="/read/digitalLogic">數位邏輯</router-link>  
      </li>
    </ul>
    <ul>
      <li>
        <router-link to="/read/sql_ANSI">4-1.ANSI SPARC 及資料庫種類</router-link>  
      </li>
      <li>
        <router-link to="/read/sql_basic">4-2. 基礎及阿姆斯狀公理</router-link>  
      </li>
      <li>
        <router-link to="/read/sql_designProcess">4-3. 資料庫設計流程</router-link>  
      </li>
      <li>
        <router-link to="/read/sql_ObjectType">4-4. 資料庫物件種類</router-link>  
      </li>
      <li>
        <router-link to="/read/sql_Intro">4-5. SQL種類</router-link>  
      </li>
      
      <li>
        <router-link to="/read/sql_Create">4-6. 建表</router-link>  
      </li>
      <li>
        <router-link to="/read/sql_CRUD">4-7. CRUD</router-link>  
      </li>
      <li>
        <router-link to="/read/sql_normal">4-8. 常用函數</router-link>  
      </li>
      <li>
        <router-link to="/read/sql_join">4-9. 多表連接</router-link>  
      </li>
      <li>
        <router-link to="/read/sqlTransaction">4-10. 交易</router-link>  
      </li>
      <li>
        <router-link to="/read/sqlTransaction _simple">4-10. 交易-easy</router-link>  
      </li>
      <li>
        <router-link to="/read/noSql">4-11. noSql</router-link>  
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
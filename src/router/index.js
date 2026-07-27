// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Read from '../views/Read.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/read/:id', name: 'Read', component: Read }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
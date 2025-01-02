import { createRouter, createWebHashHistory } from 'vue-router'
import Frontend from '../views/Frontend.vue'
import Backend from '../views/Backend.vue'
import Algorithm from '../views/Algorithm.vue'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/frontend',
      name: 'frontend',
      component: Frontend
    },
    {
      path: '/backend',
      name: 'backend',
      component: Backend
    },
    {
      path: '/algorithm',
      name: 'algorithm',
      component: Algorithm
    }
  ]
})

export default router

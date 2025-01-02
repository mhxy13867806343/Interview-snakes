<template>
  <div class="home">
    <a-layout>
      <a-layout-content style="padding: 24px 50px">
        <div class="site-layout-content">
          <h1 class="page-title">选择你感兴趣的面试题分类</h1>
          <a-row :gutter="[16, 16]">
            <a-col :span="8" v-for="category in categories" :key="category.id">
              <a-card :title="category.title" :bordered="false" class="category-card">
                <p>{{ category.description }}</p>
                <a-button type="primary" @click="goToCategory(category.route)">
                  查看详情
                </a-button>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </a-layout-content>
      
      <a-layout-footer style="text-align: center">
        面试题库 2025 Created by Vue3
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = ref([
  {
    id: 1,
    title: '前端开发',
    description: '包含HTML、CSS、JavaScript、Vue、React等前端相关面试题',
    route: '/frontend'
  },
  {
    id: 2,
    title: '后端开发',
    description: '包含Java、Python、Node.js、数据库等后端相关面试题',
    route: '/backend'
  },
  {
    id: 3,
    title: '算法题目',
    description: '包含常见算法、数据结构、LeetCode题目解析',
    route: '/algorithm'
  }
])

const goToCategory = (route) => {
  router.push(route)
}
</script>

<style scoped>
.home {
  min-height: calc(100vh - 64px);
}

.page-title {
  text-align: center;
  margin-bottom: 32px;
  color: #001529;
}

.site-layout-content {
  background: #fff;
  padding: 24px;
  min-height: 280px;
}

.category-card {
  height: 100%;
  transition: all 0.3s;
}

.category-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

:deep(.ant-card-head-title) {
  font-size: 18px;
  color: #001529;
}

:deep(.ant-layout-footer) {
  background: #f0f2f5;
}
</style>

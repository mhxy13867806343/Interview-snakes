<template>
  <div class="nav-container">
    <div class="nav-content">
      <div class="nav-left">
        <router-link to="/" class="logo-text">面试题库</router-link>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="horizontal"
          :style="{ lineHeight: '64px', background: 'transparent' }"
        >
          <a-menu-item key="frontend">
            <router-link to="/frontend">前端开发</router-link>
          </a-menu-item>
        </a-menu>
      </div>
      <div class="nav-right">
        <a href="https://github.com/mhxy13867806343/Interview-snakes" target="_blank" class="github-link">
          <github-outlined />
          <span>GitHub</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { GithubOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const selectedKeys = ref(['frontend'])
const searchText = ref('')

// 根据当前路由更新选中的菜单项
watch(() => route.path, (path) => {
  const key = path.split('/')[1]
  if (key) {
    selectedKeys.value = [key]
  }
}, { immediate: true })

const onSearch = (value) => {
  console.log('search:', value)
  // 这里可以实现搜索功能
}
</script>

<style scoped>
.nav-container {
  background: #001529;
  padding: 0 50px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-right {
  display: flex;
  align-items: center;
}

.logo-text {
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-right: 48px;
  text-decoration: none;
}

.github-link {
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

:deep(.ant-menu) {
  color: white;
  border-bottom: none;
}

:deep(.ant-menu-item) a {
  color: rgba(255, 255, 255, 0.65);
}

:deep(.ant-menu-item-selected) a {
  color: white;
}

:deep(.ant-menu-horizontal) {
  line-height: 64px;
}
</style>

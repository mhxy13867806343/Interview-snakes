<template>
  <div class="app-container">
    <nav-bar />
    <div class="main-content">
      <router-view></router-view>
    </div>
    <a-back-top />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  height: auto;
  background: #f0f2f5;
}

#app {
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ant-layout {
  min-height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ant-layout-header {
  padding: 0;
  height: 64px;
  line-height: 64px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.ant-layout-content {
  flex: 1;
  background: #f0f2f5;
  padding: 24px;
}

.app-container {
  min-height: 100vh;
}

.main-content {
  padding-top: 64px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
}
</style>

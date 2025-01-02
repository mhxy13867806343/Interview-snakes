import axios from 'axios'
import { message } from 'ant-design-vue'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:3000', // 改为你的实际后端地址
  timeout: 15000
})

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    
    // 统一返回格式
    return {
      code: res.code || 0,
      data: res.data || [],
      success: res.success || res.code === 0,
      total: res.total || 0,
      page: res.page || 1,
      pageSize: res.pageSize || 10
    }
  },
  error => {
    console.error('请求错误:', error)
    message.error('请求失败，请稍后重试')
    return {
      code: -1,
      data: [],
      success: false,
      total: 0,
      page: 1,
      pageSize: 10
    }
  }
)

export default request

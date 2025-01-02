<template>
  <div class="backend">
    <a-layout>
      <a-layout-content style="padding: 0 50px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
          <a-breadcrumb-item>后端面试题</a-breadcrumb-item>
        </a-breadcrumb>
        
        <div class="content-layout">
          <a-spin :spinning="loading">
            <a-list
              :data-source="questions"
              :pagination="pagination"
              item-layout="vertical"
              size="large"
            >
              <template #renderItem="{ item }">
                <a-list-item key="item.id">
                  <a-list-item-meta>
                    <template #title>
                      <span class="question-title">#{{ item.id }} {{ item.title }}</span>
                    </template>
                    <template #description>
                      <a-tag color="blue">{{ item.category }}</a-tag>
                      <a-tag color="green">{{ item.difficulty }}</a-tag>
                    </template>
                  </a-list-item-meta>
                  <div class="question-description">{{ item.description }}</div>
                  <template #actions>
                    <a-button type="primary" @click="showAnswer(item)">查看答案</a-button>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </a-spin>
        </div>
      </a-layout-content>
    </a-layout>

    <a-modal
      v-model:visible="modalVisible"
      :title="selectedQuestion?.title"
      width="800px"
      @ok="handleModalOk"
    >
      <div class="answer-content" v-if="selectedQuestion">
        <a-typography>
          <a-typography-title :level="4">答案解析：</a-typography-title>
          <a-typography-paragraph>
            {{ selectedQuestion.answer }}
          </a-typography-paragraph>
        </a-typography>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { getBackendQuestions } from '../api/questions'

const questions = ref([])
const loading = ref(false)
const modalVisible = ref(false)
const selectedQuestion = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const pagination = ref({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  onChange: async (page, size) => {
    try {
      currentPage.value = page
      pageSize.value = size
      await fetchQuestions()
    } catch (error) {
      console.error('Error changing page:', error)
      message.error('切换页面失败，请重试')
    }
  },
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`
})

const fetchQuestions = async () => {
  loading.value = true
  try {
    const response = await getBackendQuestions(currentPage.value, pageSize.value)
    if (response.data.code === 0) {
      questions.value = response.data.data.data
      total.value = response.data.data.total
      pagination.value = {
        ...pagination.value,
        total: total.value,
        current: currentPage.value,
        pageSize: pageSize.value
      }
    } else {
      message.error(response.data.message || '获取面试题失败')
    }
  } catch (error) {
    message.error('获取面试题失败，请稍后重试')
    console.error('Error fetching questions:', error)
  } finally {
    loading.value = false
  }
}

const showAnswer = (question) => {
  selectedQuestion.value = question
  modalVisible.value = true
}

const handleModalOk = () => {
  modalVisible.value = false
}

onMounted(() => {
  fetchQuestions()
})
</script>

<style scoped>
.backend {
  min-height: calc(100vh - 64px);
  background: #f0f2f5;
}

.content-layout {
  background: #fff;
  padding: 24px;
  min-height: 280px;
  margin-top: 24px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.question-title {
  font-size: 16px;
  font-weight: 500;
  color: #1f1f1f;
}

.question-description {
  margin: 16px 0;
  color: #595959;
  line-height: 1.5;
}

:deep(.ant-list-item) {
  background: #fff;
  padding: 24px;
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
}

:deep(.ant-list-item):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.ant-tag) {
  margin-right: 8px;
}

.answer-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 0 24px;
}

:deep(.ant-modal-body) {
  padding: 24px 0;
}

:deep(.ant-list-pagination) {
  margin-top: 24px;
  text-align: center;
}
</style>

<template>
  <div class="frontend-page">
    <a-layout>
      <a-layout-content style="padding: 24px">
        <a-breadcrumb style="margin-bottom: 16px">
          <a-breadcrumb-item>前端面试题</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="questions-container">
          <a-spin :spinning="loading">
            <a-list
              :loading="loading"
              :data-source="questions"
              :pagination="{
                total: pagination.total,
                current: pagination.current,
                pageSize: 10,
                onChange: handlePageChange,
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: false,
                size: 'default'
              }"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-card :title="item.title" :bordered="false" class="question-card">
                    <template #extra>
                      <a-tag :color="getDifficultyColor(item.difficulty)">
                        {{ item.difficulty }}
                      </a-tag>
                    </template>
                    <div class="question-content">
                      <div class="description">{{ item.description }}</div>
                      <div class="answer" v-if="item.answer">
                        <div class="section-title">参考答案：</div>
                        <div class="answer-content">{{ item.answer }}</div>
                      </div>
                      <div class="github-answer" v-if="item.githubAnswer">
                        <div class="section-title">GitHub 评论答案：</div>
                        <div class="answer-wrapper" :class="{ expanded: item.showFullAnswer }">
                          <div class="answer-content" v-html="marked(item.githubAnswer)"></div>
                        </div>
                        <div class="expand-button" @click="toggleAnswer(item)">
                          {{ item.showFullAnswer ? '收起' : '查看更多' }}
                        </div>
                      </div>
                      <div class="links" v-if="item.links && item.links.length">
                        <div class="section-title">参考链接：</div>
                        <div class="links-list">
                          <div v-for="(link, index) in item.links" :key="index" 
                               class="link-item" 
                               :class="{ 'copy-success': item.copiedIndex === index }">
                            <span class="link-text">{{ link }}</span>
                            <a-button type="link" class="copy-btn" @click="copyLink(link, item, index)">
                              <template #icon><CopyOutlined /></template>
                              复制
                            </a-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-card>
                </a-list-item>
              </template>
            </a-list>

            <a-modal
              v-model:visible="modalVisible"
              :title="currentQuestion?.title"
              width="800px"
              @cancel="handleModalClose"
              :footer="null"
            >
              <template v-if="currentQuestion">
                <div class="modal-content">
                  <div class="question-tags">
                    <a-tag color="blue">{{ currentQuestion.category }}</a-tag>
                    <a-tag :color="currentQuestion.difficulty === '简单' ? 'green' : currentQuestion.difficulty === '中等' ? 'orange' : 'red'">
                      {{ currentQuestion.difficulty }}
                    </a-tag>
                  </div>
                  <div class="question-description">{{ currentQuestion.description }}</div>
                  <div class="answer-section">
                    <a-button 
                      type="primary" 
                      @click="toggleAnswer" 
                      class="view-answer-btn"
                    >
                      {{ showAnswer ? '收起答案' : '查看答案' }}
                    </a-button>
                    <div v-if="showAnswer" class="answer-content">
                      <template v-for="(part, index) in splitAnswer(currentQuestion.answer)" :key="index">
                        <span v-if="part.type === 'text'">{{ part.content }}</span>
                      </template>
                      <div class="reference-links">
                        <template v-for="(part, index) in splitAnswer(currentQuestion.answer)" :key="index">
                          <a v-if="part.type === 'link'" :href="part.content" target="_blank" class="question-link">
                            {{ part.content }}
                          </a>
                        </template>
                      </div>
                      <div v-if="currentQuestion.githubAnswer" class="github-answer">
                        <h3>GitHub 评论答案</h3>
                        <a-typography-paragraph>
                          <div v-html="marked(currentQuestion.githubAnswer)"></div>
                        </a-typography-paragraph>
                      </div>
                      <div v-else class="github-answer">
                        <a-empty description="暂无 GitHub 评论答案" />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </a-modal>
          </a-spin>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { CopyOutlined } from '@ant-design/icons-vue';
import { marked } from 'marked';
import axios from 'axios';

const loading = ref(false);
const questions = ref([]);
const pagination = ref({
  current: 1,
  total: 0
});

const handlePageChange = (page) => {
  pagination.value.current = page;
  fetchQuestions();
};

const fetchQuestions = async () => {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:3000/api/questions/frontend', {
      params: {
        page: pagination.value.current,
        pageSize: 10
      }
    });
    
    if (response.data.success) {
      questions.value = response.data.data.map(q => ({
        ...q,
        showFullAnswer: false,
        copiedIndex: -1
      }));
      pagination.value.total = response.data.total;
    }
  } catch (error) {
    console.error('获取题目失败:', error);
    message.error('获取题目失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const modalVisible = ref(false);
const currentQuestion = ref(null);
const showAnswer = ref(false);

const splitAnswer = (answer) => {
  if (!answer) return []
  const urlRegex = /(\[.*?\])?\((https?:\/\/[^\s)]+)\)/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = urlRegex.exec(answer)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: answer.slice(lastIndex, match.index)
      })
    }

    // Add the link
    const linkText = match[1] ? match[1].slice(1, -1) : match[2]
    parts.push({
      type: 'link',
      content: match[2]
    })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < answer.length) {
    parts.push({
      type: 'text',
      content: answer.slice(lastIndex)
    })
  }

  return parts
}

const showQuestionDetail = async (question) => {
  try {
    currentQuestion.value = question;
    modalVisible.value = true;
    
    // 如果有 GitHub 链接，尝试获取评论内容
    if (question.links && question.links.length > 0) {
      loading.value = true;
      const issueUrl = question.links[0];
      const issueNumber = issueUrl.split('/').pop();
      
      try {
        const response = await axios.get(`https://api.github.com/repos/haizlin/fe-interview/issues/${issueNumber}/comments`);
        if (response.data && response.data.length > 0) {
          // 找到第一个评论
          const firstComment = response.data[0];
          currentQuestion.value = {
            ...question,
            githubAnswer: firstComment.body
          };
        }
      } catch (error) {
        console.error('获取 GitHub 评论失败:', error);
      }
    }
  } catch (error) {
    console.error('显示问题详情失败:', error);
    message.error('显示问题详情失败');
  } finally {
    loading.value = false;
  }
};

const handleModalClose = () => {
  modalVisible.value = false
  currentQuestion.value = null
  showAnswer.value = false
}

const toggleAnswer = (item) => {
  item.showFullAnswer = !item.showFullAnswer;
};

const markdownToHtml = (markdown) => {
  try {
    return marked(markdown)
  } catch (error) {
    console.error('Markdown 转换失败:', error)
    return markdown
  }
}

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case '简单':
      return 'green'
    case '中等':
      return 'orange'
    default:
      return 'red'
  }
}

const shouldShowExpandButton = (text) => {
  if (!text) return false;
  const lines = text.split('\n').length;
  return lines > 3;
};

const copyLink = async (link, item, index) => {
  try {
    await navigator.clipboard.writeText(link);
    item.copiedIndex = index;
    message.success('复制成功');
    setTimeout(() => {
      item.copiedIndex = -1;
    }, 2000);
  } catch (err) {
    message.error('复制失败');
  }
};

const formatLinkText = (link) => {
  const matches = link.match(/\[(.*?)\]/);
  return matches ? matches[1] : link;
};

const formatLinkUrl = (link) => {
  const matches = link.match(/\((.*?)\)/);
  return matches ? matches[1] : '';
};

const handleLinkClick = (link) => {
  const url = formatLinkUrl(link);
  if (url) {
    // 不进行跳转，只是为了保持链接的样式
    return false;
  }
};

onMounted(() => {
  fetchQuestions()
})
</script>

<style scoped>
.frontend-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.questions-container {
  flex: 1;
  background: #fff;
  padding: 24px;
  border-radius: 2px;
}

:deep(.ant-list) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.ant-spin-nested-loading) {
  flex: 1;
}

:deep(.ant-spin-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.ant-list-items) {
  flex: 1;
}

:deep(.ant-list-pagination) {
  margin-top: 16px;
  text-align: center;
}

.question-card {
  width: 100%;
  margin-bottom: 16px;
}

.content-layout {
  flex: 1;
  background: #fff;
  padding: 24px;
  min-height: 280px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.questions-container {
  flex: 1;
  padding: 24px;
  background: #f0f2f5;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
}

.question-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.question-description {
  color: #666;
  margin-bottom: 16px;
}

.answer-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.question-link {
  color: #1890ff;
  text-decoration: none;
}

.question-link:hover {
  text-decoration: underline;
}

.action-buttons {
  margin-top: 16px;
}

:deep(.ant-btn) {
  border-radius: 4px;
}

:deep(.ant-list-item) {
  background: #fff;
  padding: 24px;
  margin-bottom: 16px;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

:deep(.ant-list-item:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

:deep(.ant-tag) {
  margin-left: 8px;
}

:deep(.ant-list-pagination) {
  margin-top: 16px;
  text-align: center;
}

:deep(.ant-pagination-options) {
  margin-left: 16px;
}

:deep(.ant-list-item-meta-title) {
  margin-bottom: 16px !important;
}

:deep(.ant-list-item-meta-description) {
  color: rgba(0, 0, 0, 0.65);
}

:deep(.ant-pagination) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.modal-content {
  padding: 0 24px;
}

.question-tags {
  margin-bottom: 16px;
}

.answer-section {
  margin-top: 24px;
}

.view-answer-btn {
  margin-bottom: 16px;
}

.answer-content {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

.reference-links {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.question-link {
  display: block;
  color: #1890ff;
  text-decoration: none;
  margin-bottom: 8px;
}

.question-link:hover {
  text-decoration: underline;
}

:deep(.ant-list-item) {
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.ant-list-item:hover) {
  background: #f8f9fa;
}

:deep(.ant-modal-body) {
  max-height: 70vh;
  overflow-y: auto;
}

.github-answer {
  margin-top: 16px;
}

.answer-wrapper {
  position: relative;
  max-height: 100px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.answer-wrapper.expanded {
  max-height: none;
}

.answer-wrapper:not(.expanded)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  pointer-events: none;
}

.expand-button {
  display: inline-block;
  color: #1890ff;
  cursor: pointer;
  padding: 8px 16px;
  margin-top: 8px;
  transition: all 0.3s ease;
  border-radius: 4px;
  user-select: none;
}

.expand-button:hover {
  background: rgba(24, 144, 255, 0.1);
}

:deep(.answer-content) {
  line-height: 1.6;
  font-size: 14px;
}

:deep(.answer-content p) {
  margin-bottom: 12px;
}

:deep(.answer-content pre) {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 12px 0;
}

:deep(.answer-content code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.link-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.link-item.copy-success {
  background-color: #f6ffed;
}

.link-text {
  color: #1890ff;
  font-size: 14px;
  margin-right: 16px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}

.copy-btn {
  padding: 0 8px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
}

.copy-btn .anticon {
  margin-right: 4px;
}

:deep(.ant-btn-link) {
  color: #1890ff;
  padding: 4px 8px;
  height: auto;
}

:deep(.ant-btn-link:hover) {
  color: #40a9ff;
  background-color: rgba(24, 144, 255, 0.1);
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f1f1f;
  margin-bottom: 4px;
}

@media screen and (max-width: 768px) {
  .questions-container {
    padding: 16px;
  }

  :deep(.ant-list-item) {
    padding: 16px;
  }
}
</style>

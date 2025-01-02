import axios from 'axios';
import config from '../config.js';

// 使用环境变量或配置文件中的值
const { github } = config;

const GITHUB_API_BASE = github.apiBase;
const GITHUB_RAW_BASE = github.rawBase;

// 创建一个带认证的 axios 实例
const githubAxios = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${github.token}`,
  }
});

// 后端面试题的 GitHub 仓库列表
const REPOS = [
  {
    owner: 'CyC2018',
    repo: 'CS-Notes',
    path: 'notes'
  },
  {
    owner: 'doocs',
    repo: 'advanced-java',
    path: 'docs'
  },
  {
    owner: 'Snailclimb',
    repo: 'JavaGuide',
    path: 'docs'
  }
];

async function fetchGithubContent(owner, repo, path) {
  try {
    let questions = [];
    
    // 获取目录内容
    const response = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    for (const item of response.data) {
      if (item.type === 'file' && item.name.endsWith('.md')) {
        const contentResponse = await axios.get(item.download_url);
        const content = contentResponse.data;
        questions = questions.concat(parseMarkdownContent(content));
      } else if (item.type === 'dir') {
        // 递归获取子目录的内容
        const subQuestions = await fetchGithubContent(owner, repo, item.path);
        questions = questions.concat(subQuestions);
      }
    }
    
    return questions;
  } catch (error) {
    console.error('Error fetching from Github:', error);
    return [];
  }
}

function parseMarkdownContent(content) {
  const questions = [];
  const lines = content.split('\n');
  let currentQuestion = null;
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 处理代码块
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (currentQuestion) {
        currentQuestion.answer += line + '\n';
      }
      continue;
    }
    
    // 在代码块内，所有内容都属于答案
    if (inCodeBlock && currentQuestion) {
      currentQuestion.answer += line + '\n';
      continue;
    }
    
    // 检测新问题的开始
    if (line.startsWith('###') || line.startsWith('##') || (line.startsWith('#') && !line.startsWith('##'))) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      currentQuestion = {
        id: questions.length + 1,
        title: line.replace(/^#+\s+/, '').trim(),
        category: '后端',
        difficulty: line.toLowerCase().includes('基础') ? '简单' : 
                   line.toLowerCase().includes('进阶') ? '困难' : '中等',
        description: '',
        answer: ''
      };
    } else if (currentQuestion) {
      if (line.toLowerCase().includes('答案') || line.toLowerCase().includes('解答') || 
          line.toLowerCase().includes('solution') || line.toLowerCase().includes('分析')) {
        currentQuestion.answer += line + '\n';
      } else {
        currentQuestion.description += line + '\n';
      }
    }
  }
  
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  
  return questions.map(q => ({
    ...q,
    description: q.description.trim(),
    answer: q.answer.trim() || '解答正在整理中...'
  }));
}

function getDifficulty(labels) {
  if (!Array.isArray(labels)) return '中等';
  
  const labelNames = labels.map(label => label.name.toLowerCase());
  
  if (labelNames.some(name => name.includes('easy') || name.includes('基础'))) {
    return '简单';
  }
  if (labelNames.some(name => name.includes('hard') || name.includes('困难'))) {
    return '困难';
  }
  return '中等';
}

export async function fetchBackendQuestions(page = 1, pageSize = 10) {
  try {
    // 获取后端面试题仓库的面试题
    const response = await githubAxios.get('https://api.github.com/repos/yifeikong/reverse-interview-zh/issues', {
      params: {
        state: 'open',
        per_page: pageSize,
        page: page
      }
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format from GitHub API');
    }

    const questions = await Promise.all(response.data.map(async (issue, index) => {
      let githubAnswer = '';
      try {
        const commentsResponse = await githubAxios.get(issue.comments_url);
        if (commentsResponse.data && commentsResponse.data.length > 0) {
          githubAnswer = commentsResponse.data[0].body;
        }
      } catch (error) {
        console.error('获取评论失败:', error);
      }

      return {
        id: (page - 1) * pageSize + index + 1,
        title: issue.title,
        category: '后端',
        difficulty: getDifficulty(issue.labels || []),
        description: issue.body || '暂无描述',
        answer: '',
        githubAnswer,
        showAnswer: false,
        links: issue.html_url ? [issue.html_url] : []
      };
    }));

    return {
      code: 0,
      data: questions,
      success: true,
      total: parseInt(response.headers['x-total-count']) || questions.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  } catch (error) {
    console.error('Error fetching backend questions:', error);
    if (error.response?.status === 403) {
      return {
        code: -1,
        data: [],
        success: false,
        message: 'GitHub API 访问限制，请稍后再试或配置 Token',
        error: error.message
      };
    }
    return {
      code: -1,
      data: [],
      success: false,
      message: '获取面试题失败',
      error: error.message
    };
  }
}

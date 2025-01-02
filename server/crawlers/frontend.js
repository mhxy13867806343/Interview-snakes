import axios from 'axios';
import config from '../config.js';

const { github } = config;

const githubAxios = axios.create({
  baseURL: github.apiBase,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${github.token}`,
  }
});

// 前端面试题的 GitHub 仓库列表
const REPOS = [
  {
    owner: 'haizlin',
    repo: 'fe-interview',
    path: 'category'
  },
  {
    owner: 'paddingme',
    repo: 'Front-end-Web-Development-Interview-Question',
    path: 'questions'
  },
  {
    owner: 'qiu-deqing',
    repo: 'FE-interview',
    path: 'README.md'
  },
  {
    owner: 'Advanced-Frontend',
    repo: 'Daily-Interview-Question',
    path: 'README.md'
  }
];

async function fetchGithubContent(owner, repo, path) {
  try {
    let questions = [];
    
    if (path.endsWith('.md')) {
      // 如果是单个文件
      const response = await githubAxios.get(`/repos/${owner}/${repo}/contents/${path}`);
      
      const content = response.data;
      questions = questions.concat(parseMarkdownContent(content));
    } else {
      // 如果是目录
      const response = await githubAxios.get(`/repos/${owner}/${repo}/contents/${path}`);

      for (const file of response.data) {
        if (file.type === 'file' && file.name.endsWith('.md')) {
          const contentResponse = await axios.get(file.download_url);
          const content = contentResponse.data;
          questions = questions.concat(parseMarkdownContent(content));
        }
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
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 检测新问题的开始
    if (line.startsWith('###') || line.startsWith('##') || (line.startsWith('#') && !line.startsWith('##'))) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      currentQuestion = {
        id: questions.length + 1,
        title: line.replace(/^#+\s+/, '').trim(),
        category: '前端',
        difficulty: line.toLowerCase().includes('基础') ? '简单' : 
                   line.toLowerCase().includes('进阶') ? '中等' : '中等',
        description: '',
        answer: ''
      };
    } else if (currentQuestion) {
      if (line.toLowerCase().includes('答案') || line.toLowerCase().includes('解答') || line.startsWith('```')) {
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

export async function fetchFrontendQuestions(page = 1, pageSize = 10) {
  try {
    // 先获取总数
    const countResponse = await githubAxios.get('https://api.github.com/search/issues', {
      params: {
        q: 'repo:haizlin/fe-interview is:issue is:open',
        per_page: 1
      }
    });

    const total = countResponse.data.total_count;

    // 获取当前页的面试题
    const response = await githubAxios.get('https://api.github.com/repos/haizlin/fe-interview/issues', {
      params: {
        state: 'open',
        per_page: pageSize,
        page: page,
        sort: 'created',
        direction: 'desc'
      }
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format from GitHub API');
    }

    // 获取每个问题的评论
    const questions = await Promise.all(response.data.map(async (issue, index) => {
      // 获取评论
      let githubAnswer = '';
      try {
        const commentsResponse = await githubAxios.get(issue.comments_url);
        if (commentsResponse.data && commentsResponse.data.length > 0) {
          githubAnswer = commentsResponse.data[0].body;
        }
      } catch (error) {
        console.error('获取评论失败:', error);
      }

      // 从 issue body 中提取描述和答案
      const bodyParts = (issue.body || '').split('\n').filter(line => line.trim());
      const description = bodyParts[0] || '暂无描述';
      const answer = bodyParts.slice(1).join('\n') || '暂无答案';

      // 从标题中提取分类
      const titleMatch = issue.title.match(/\[(.*?)\]/);
      const category = titleMatch ? titleMatch[1].toUpperCase() : '前端';

      return {
        id: issue.number,
        title: issue.title.replace(/\[.*?\]\s*/, ''),
        category,
        difficulty: getDifficulty(issue.labels || []),
        description,
        answer,
        githubAnswer,
        showAnswer: false,
        links: [
          `[3+1官网](http://www.h-camel.com/index.html)`,
          `[我也要出题](http://www.h-camel.com/contribution.html)`
        ]
      };
    }));

    return {
      code: 0,
      data: questions,
      success: true,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  } catch (error) {
    console.error('Error fetching frontend questions:', error);
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

export {
  fetchGithubContent,
  parseMarkdownContent,
};

import axios from 'axios';
import config from '../config.js';

// 使用环境变量或配置文件中的值
const { github } = config;

const GITHUB_RAW_BASE = github.rawBase;

// 算法面试题的 GitHub 仓库列表
const REPOS = [
  {
    owner: 'labuladong',
    repo: 'fucking-algorithm',
    path: 'README.md'
  },
  {
    owner: 'azl397985856',
    repo: 'leetcode',
    path: 'README.md'
  },
  {
    owner: 'halfrost',
    repo: 'LeetCode-Go',
    path: 'README.md'
  }
];

// 创建一个带认证的 axios 实例
const githubAxios = axios.create({
  baseURL: github.apiBase,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${github.token}`,
  }
});

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

async function fetchGithubContent(owner, repo, path) {
  try {
    // 获取文件内容
    const response = await axios.get(`${GITHUB_RAW_BASE}/${owner}/${repo}/master/${path}`, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    
    return parseMarkdownContent(response.data);
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
    if ((line.startsWith('###') || line.startsWith('##')) && 
        (line.includes('题') || line.includes('problem') || line.includes('leetcode'))) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      // 从标题中提取难度信息
      const difficulty = line.toLowerCase().includes('easy') ? '简单' :
                        line.toLowerCase().includes('hard') ? '困难' :
                        line.toLowerCase().includes('medium') ? '中等' : '中等';
      
      currentQuestion = {
        id: questions.length + 1,
        title: line.replace(/^#+\s+/, '').trim(),
        category: '算法',
        difficulty,
        description: '',
        answer: ''
      };
    } else if (currentQuestion) {
      if (line.toLowerCase().includes('解法') || line.toLowerCase().includes('solution') || 
          line.toLowerCase().includes('思路') || line.toLowerCase().includes('分析')) {
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

export async function fetchAlgorithmQuestions(page = 1, pageSize = 10, searchQuery = '') {
  try {
    let allQuestions = [];
    
    // 从所有配置的仓库获取题目
    for (const repo of REPOS) {
      const questions = await fetchGithubContent(repo.owner, repo.repo, repo.path);
      allQuestions = allQuestions.concat(questions);
    }
    
    // 获取算法面试题仓库的面试题
    const response = await githubAxios.get('https://api.github.com/repos/doocs/leetcode/issues', {
      params: {
        state: 'open',
        per_page: pageSize,
        page: page
      }
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format from GitHub API');
    }

    const githubQuestions = await Promise.all(response.data.map(async (issue, index) => {
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
        category: '算法',
        difficulty: getDifficulty(issue.labels || []),
        description: issue.body || '暂无描述',
        answer: '',
        githubAnswer,
        showAnswer: false,
        links: issue.html_url ? [issue.html_url] : []
      };
    }));

    allQuestions = allQuestions.concat(githubQuestions);

    // 如果有搜索关键词，进行过滤
    if (searchQuery) {
      allQuestions = allQuestions.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 计算分页
    const total = allQuestions.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedQuestions = allQuestions.slice(start, end);
    
    return {
      code: 0,
      data: paginatedQuestions,
      success: true,
      total,
      page,
      pageSize
    };
  } catch (error) {
    console.error('Error fetching algorithm questions:', error);
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

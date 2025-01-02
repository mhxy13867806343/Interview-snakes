import express from 'express';
import cors from 'cors';
import { fetchFrontendQuestions } from './crawlers/frontend.js';
import { fetchBackendQuestions } from './crawlers/backend.js';
import { fetchAlgorithmQuestions } from './crawlers/algorithm.js';
import NodeCache from 'node-cache';

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // 缓存1小时

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 获取前端面试题
app.get('/api/questions/frontend', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchQuery = req.query.searchQuery || '';
    
    const cacheKey = `frontend_${page}_${pageSize}_${searchQuery}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const data = await fetchFrontendQuestions(page, pageSize, searchQuery);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error in /api/questions/frontend:', error);
    res.status(500).json({
      code: -1,
      data: [],
      success: false,
      total: 0,
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10
    });
  }
});

// 获取后端面试题
app.get('/api/questions/backend', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchQuery = req.query.searchQuery || '';
    
    const cacheKey = `backend_${page}_${pageSize}_${searchQuery}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const data = await fetchBackendQuestions(page, pageSize, searchQuery);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error in /api/questions/backend:', error);
    res.status(500).json({
      code: -1,
      data: [],
      success: false,
      total: 0,
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10
    });
  }
});

// 获取算法面试题
app.get('/api/questions/algorithm', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchQuery = req.query.searchQuery || '';
    
    const cacheKey = `algorithm_${page}_${pageSize}_${searchQuery}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const data = await fetchAlgorithmQuestions(page, pageSize, searchQuery);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error in /api/questions/algorithm:', error);
    res.status(500).json({
      code: -1,
      data: [],
      success: false,
      total: 0,
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10
    });
  }
});

// 搜索面试题
app.get('/api/search', async (req, res) => {
  try {
    const { q: query, type, page = 1, pageSize = 10 } = req.query;
    
    if (!query || !type) {
      return res.status(400).json({
        code: -1,
        data: [],
        success: false,
        total: 0,
        page: parseInt(req.query.page) || 1,
        pageSize: parseInt(req.query.pageSize) || 10
      });
    }
    
    let data;
    switch (type) {
      case 'frontend':
        data = await fetchFrontendQuestions(page, pageSize, query);
        break;
      case 'backend':
        data = await fetchBackendQuestions(page, pageSize, query);
        break;
      case 'algorithm':
        data = await fetchAlgorithmQuestions(page, pageSize, query);
        break;
      default:
        return res.status(400).json({
          code: -1,
          data: [],
          success: false,
          total: 0,
          page: parseInt(req.query.page) || 1,
          pageSize: parseInt(req.query.pageSize) || 10
        });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error in /api/search:', error);
    res.status(500).json({
      code: -1,
      data: [],
      success: false,
      total: 0,
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import express from 'express';
import { fetchFrontendQuestions } from '../crawlers/frontend.js';
import { backendQuestions, algorithmQuestions } from '../data/questions.js';

const router = express.Router();

// 分页辅助函数
const paginateQuestions = (questions, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const total = questions.length;
  const data = questions.slice(startIndex, endIndex);

  return {
    code: 0,
    success: true,
    data,
    total,
    page: parseInt(page),
    pageSize: parseInt(pageSize),
  };
};

// 前端面试题 - 从GitHub获取
router.get('/frontend', async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const result = await fetchFrontendQuestions(page, pageSize);
    res.json(result);
  } catch (error) {
    console.error('Error in frontend questions route:', error);
    res.status(500).json({
      code: -1,
      success: false,
      message: '获取面试题失败',
      error: error.message
    });
  }
});

// 后端面试题
router.get('/backend', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const result = paginateQuestions(backendQuestions, page, pageSize);
  res.json(result);
});

// 算法面试题
router.get('/algorithm', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const result = paginateQuestions(algorithmQuestions, page, pageSize);
  res.json(result);
});

export default router;

import express from 'express';
import cors from 'cors';
import questionsRouter from './routes/questions.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 路由
app.use('/api/questions', questionsRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: -1,
    success: false,
    message: '服务器内部错误'
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

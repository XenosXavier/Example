import express from 'express';
import cors from 'cors';
import todoRoutes from './presentation/routes/todoRoutes';
import { errorHandler } from './presentation/middleware/errorHandler';

const app = express();

// === Middleware ===
// CORS - 允許前端跨域請求
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// 解析 JSON 請求 body
app.use(express.json());

// === Routes ===
app.use('/api', todoRoutes);

// === 404 處理 ===
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// === 錯誤處理中介層（必須放在最後）===
app.use(errorHandler);

export default app;

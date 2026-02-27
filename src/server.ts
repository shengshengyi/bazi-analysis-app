import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import baziRoutes from './routes/bazi.routes.js';
import analyzeRoutes from './routes/analyze.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../public')));

// API 路由
app.use('/api/bazi', baziRoutes);
app.use('/api/analyze', analyzeRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 前端页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     八字分析应用服务器已启动            ║
╠════════════════════════════════════════╣
║  地址: http://localhost:${PORT}           ║
║  API文档: http://localhost:${PORT}/api   ║
╚════════════════════════════════════════╝
  `);
});

export default app;

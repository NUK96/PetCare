/**
 * PetCare Backend - Node.js + Express
 * 宠物健康管理应用后端服务
 * 
 * @version 1.0.0
 * @author NUK96
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// 使用 SQLite (快速部署模式)
const db = require('./config/database.sqlite');
console.log('✅ SQLite database initialized');

// 导入路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const petRoutes = require('./routes/pets');
const vaccineRoutes = require('./routes/vaccines');
const dewormingRoutes = require('./routes/dewormings');
const healthRoutes = require('./routes/health');
const knowledgeRoutes = require('./routes/knowledge');

// 导入中间件
const authMiddleware = require('./middleware/auth');

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet()); // 安全头
app.use(cors()); // 跨域
app.use(compression()); // 压缩
app.use(morgan('combined')); // 日志
app.use(express.json()); // JSON 解析
app.use(express.urlencoded({ extended: true })); // URL 编码解析

// 静态文件服务 (首页和测试页面)
app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public')));

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PetCare Backend',
    version: '1.0.0'
  });
});

// API 路由
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authMiddleware, userRoutes);
app.use('/api/v1/pets', authMiddleware, petRoutes);
app.use('/api/v1/vaccines', authMiddleware, vaccineRoutes);
app.use('/api/v1/dewormings', authMiddleware, dewormingRoutes);
app.use('/api/v1/health', authMiddleware, healthRoutes);
app.use('/api/v1/knowledge', knowledgeRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    path: req.path
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 启动服务器 (监听 0.0.0.0 允许外部访问)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🐾 PetCare Backend Service                  ║
║                                               ║
║   Version: 1.0.0                              ║
║   Port: ${PORT}                                    ║
║   Host: 0.0.0.0                               ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                               ║
║   Ready to serve!                             ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);
});

module.exports = app;

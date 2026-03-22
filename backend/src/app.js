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
require('dotenv').config();

// 导入路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const petRoutes = require('./routes/pets');
const vaccineRoutes = require('./routes/vaccines');
const dewormingRoutes = require('./routes/dewormings');
const healthRoutes = require('./routes/health');
const knowledgeRoutes = require('./routes/knowledge');

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
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/pets', petRoutes);
app.use('/api/v1/vaccines', vaccineRoutes);
app.use('/api/v1/dewormings', dewormingRoutes);
app.use('/api/v1/health', healthRoutes);
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

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🐾 PetCare Backend Service                  ║
║                                               ║
║   Version: 1.0.0                              ║
║   Port: ${PORT}                                    ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                               ║
║   Ready to serve!                             ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);
});

module.exports = app;

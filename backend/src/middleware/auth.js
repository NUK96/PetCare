/**
 * JWT 认证中间件
 * 验证用户 Token 有效性
 */

const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  try {
    // 从 Header 获取 Token
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        message: '未授权，请登录后重试'
      });
    }
    
    // 提取 Bearer Token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: 'Token 格式错误'
      });
    }
    
    // 验证 Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    // 将用户信息附加到请求对象
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        message: 'Token 已过期，请重新登录'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 401,
        message: 'Token 无效'
      });
    }
    
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

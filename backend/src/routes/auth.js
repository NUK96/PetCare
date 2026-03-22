/**
 * 认证路由
 * 微信登录、Token 管理
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * @route   POST /api/v1/auth/login
 * @desc    微信登录
 * @access  Public
 */
router.post('/login', [
  body('code', '微信登录 code 必填').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    const { code } = req.body;

    // TODO: 调用微信 API 获取 openid
    // const wxResponse = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
    //   params: {
    //     appid: process.env.WECHAT_APPID,
    //     secret: process.env.WECHAT_SECRET,
    //     js_code: code,
    //     grant_type: 'authorization_code'
    //   }
    // });
    // const { openid, unionid } = wxResponse.data;

    // 模拟数据 (开发环境)
    const openid = `mock_openid_${code}`;
    const unionid = `mock_unionid_${code}`;

    // 查找或创建用户
    let user = await User.findByOpenId(openid);
    
    if (!user) {
      user = await User.create({
        openid,
        unionid,
        nickname: `用户${openid.slice(-6)}`,
        avatar: ''
      });
    }

    // 生成 JWT Token
    const token = jwt.sign(
      { id: user.id, openid: user.openid },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          vip_level: user.vip_level
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        vip_level: user.vip_level,
        vip_expire_at: user.vip_expire_at,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    更新用户信息
 * @access  Private
 */
router.put('/profile', [
  require('../middleware/auth'),
  body('nickname', '昵称太长').optional().isLength({ max: 50 }),
  body('phone', '手机号格式错误').optional().isMobilePhone('zh-CN')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    const user = await User.update(req.user.id, req.body);

    res.json({
      code: 200,
      message: '更新成功',
      data: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;

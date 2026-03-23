/**
 * 用户路由
 * 用户信息管理
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * @route   GET /api/v1/users
 * @desc    获取当前用户信息 (兼容接口)
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        code: 401,
        message: '未授权'
      });
    }

    const user = await User.findById(userId);
    
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
        phone: user.phone,
        vip_level: user.vip_level,
        vip_expire_at: user.vip_expire_at,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   PUT /api/v1/users/:id
 * @desc    更新用户信息
 * @access  Private
 */
router.put('/:id', [
  body('nickname', '昵称不能超过 50 个字符').optional().isLength({ max: 50 }),
  body('phone', '手机号格式错误').optional().isMobilePhone('zh-CN'),
  body('avatar', '头像 URL 格式错误').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    const userId = parseInt(req.params.id);
    
    // 验证权限
    if (req.user.id !== userId) {
      return res.status(403).json({
        code: 403,
        message: '无权修改其他用户信息'
      });
    }

    const user = await User.update(userId, req.body);

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
    console.error('Update user error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    删除用户账号
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // 验证权限
    if (req.user.id !== userId) {
      return res.status(403).json({
        code: 403,
        message: '无权删除其他用户账号'
      });
    }

    await User.delete(userId);

    res.json({
      code: 200,
      message: '账号已删除'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;

/**
 * 知识库路由
 */

const express = require('express');
const router = express.Router();
const { param, query, validationResult } = require('express-validator');

/**
 * @route   GET /api/v1/knowledge
 * @desc    获取知识库列表
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category, breed, keyword, page = 1, pageSize = 20 } = req.query;
    const db = require('../config/database.sqlite');
    
    let sql = `SELECT * FROM knowledge_base WHERE is_published = 1`;
    const params = [];
    
    if (category) {
      sql += ` AND category = ?`;
      params.push(category);
    }
    
    if (breed) {
      sql += ` AND (breed = ? OR breed IS NULL)`;
      params.push(breed);
    }
    
    if (keyword) {
      sql += ` AND (title LIKE ? OR content LIKE ?)`;
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    
    const offset = (page - 1) * pageSize;
    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(pageSize), offset);
    
    const list = await db.query(sql, params);
    
    const countSql = `SELECT COUNT(*) as total FROM knowledge_base WHERE is_published = 1`;
    const total = await db.queryOne(countSql);
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        list,
        total: total.total || 0,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('Get knowledge error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   GET /api/v1/knowledge/:id
 * @desc    获取知识库详情
 * @access  Public
 */
router.get('/:id', [
  param('id', 'Invalid ID').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    // TODO: 查询知识库详情
    // const article = await KnowledgeBase.findById(req.params.id);

    res.json({
      code: 200,
      message: 'success',
      data: {}
    });
  } catch (error) {
    console.error('Get knowledge detail error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   GET /api/v1/knowledge/search
 * @desc    搜索知识库
 * @access  Public
 */
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, pageSize = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        code: 400,
        message: '搜索关键词不能为空'
      });
    }

    // TODO: 搜索知识库
    // const articles = await KnowledgeBase.search(q);

    res.json({
      code: 200,
      message: 'success',
      data: {
        list: [],
        total: 0,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('Search knowledge error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;

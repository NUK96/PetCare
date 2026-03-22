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
    
    // TODO: 查询知识库
    // const articles = await KnowledgeBase.find({ category, breed, keyword });

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

/**
 * 健康记录路由
 */

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

/**
 * @route   GET /api/v1/health
 * @desc    获取健康记录列表
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const { pet_id, type } = req.query;
    
    // TODO: 查询健康记录
    // const records = await HealthRecord.find({ pet_id, type });

    res.json({
      code: 200,
      message: 'success',
      data: []
    });
  } catch (error) {
    console.error('Get health records error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   GET /api/v1/health/weight-trend
 * @desc    获取体重趋势
 * @access  Private
 */
router.get('/weight-trend', [
  param('pet_id', 'Pet ID required').isInt({ min: 1 })
], async (req, res) => {
  try {
    const { pet_id } = req.query;
    
    // TODO: 查询体重数据
    // const weights = await HealthRecord.find({ pet_id, type: 'weight' });

    res.json({
      code: 200,
      message: 'success',
      data: []
    });
  } catch (error) {
    console.error('Get weight trend error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   POST /api/v1/health
 * @desc    添加健康记录
 * @access  Private
 */
router.post('/', [
  body('pet_id', 'Pet ID required').isInt({ min: 1 }),
  body('record_type', 'Invalid type').isIn(['weight', 'illness', 'medicine', 'checkup', 'symptom']),
  body('record_date', 'Invalid date').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    const { pet_id, record_type, record_date, weight, temperature, diagnosis, prescription, symptoms } = req.body;

    res.status(201).json({
      code: 201,
      message: '健康记录添加成功',
      data: { id: 1 }
    });
  } catch (error) {
    console.error('Create health record error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   DELETE /api/v1/health/:id
 * @desc    删除健康记录
 * @access  Private
 */
router.delete('/:id', [
  param('id', 'Invalid ID').isInt({ min: 1 })
], async (req, res) => {
  try {
    res.json({
      code: 200,
      message: '健康记录删除成功'
    });
  } catch (error) {
    console.error('Delete health record error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;

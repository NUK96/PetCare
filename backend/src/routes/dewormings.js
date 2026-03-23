/**
 * 驱虫记录路由
 */

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Deworming = require('../models/Deworming');
const Pet = require('../models/Pet');

/**
 * @route   GET /api/v1/dewormings
 * @desc    获取驱虫记录列表
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const { pet_id, type } = req.query;
    
    if (pet_id) {
      // 验证宠物归属
      const pet = await Pet.findById(parseInt(pet_id));
      if (!pet || pet.user_id !== req.user.id) {
        return res.status(403).json({
          code: 403,
          message: '无权查看此宠物的驱虫记录'
        });
      }
    }

    const dewormings = await Deworming.find({ pet_id, type });

    res.json({
      code: 200,
      message: 'success',
      data: dewormings
    });
  } catch (error) {
    console.error('Get dewormings error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   GET /api/v1/dewormings/:id
 * @desc    获取单个驱虫记录详情
 * @access  Private
 */
router.get('/:id', [
  param('id', '无效的记录 ID').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    const dewormingId = parseInt(req.params.id);
    const deworming = await Deworming.findById(dewormingId);

    if (!deworming) {
      return res.status(404).json({
        code: 404,
        message: '驱虫记录不存在'
      });
    }

    // 验证权限
    const pet = await Pet.findById(deworming.pet_id);
    if (!pet || pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权查看此驱虫记录'
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: deworming
    });
  } catch (error) {
    console.error('Get deworming error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   POST /api/v1/dewormings
 * @desc    添加驱虫记录
 * @access  Private
 */
router.post('/', [
  body('pet_id', '宠物 ID 必填').isInt({ min: 1 }),
  body('type', '驱虫类型必填').isIn(['internal', 'external', 'both']),
  body('deworm_date', '驱虫日期必填').isISO8601(),
  body('next_date', '下次日期格式错误').optional().isISO8601(),
  body('product_name', '产品名称不能超过 100 字符').optional().isLength({ max: 100 }),
  body('dosage', '剂量不能超过 50 字符').optional().isLength({ max: 50 }),
  body('note', '备注不能超过 500 字符').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    const { pet_id } = req.body;
    
    // 验证宠物归属
    const pet = await Pet.findById(parseInt(pet_id));
    if (!pet) {
      return res.status(404).json({
        code: 404,
        message: '宠物不存在'
      });
    }
    if (pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权为此宠物添加驱虫记录'
      });
    }

    // 自动计算下次驱虫日期 (如果未提供)
    let dewormingData = { ...req.body };
    if (!dewormingData.next_date && dewormingData.deworm_date) {
      const dewormDate = new Date(dewormingData.deworm_date);
      const nextDate = new Date(dewormDate);
      // 体内驱虫 3 个月，体外驱虫 1 个月
      if (dewormingData.type === 'internal') {
        nextDate.setMonth(nextDate.getMonth() + 3);
      } else if (dewormingData.type === 'external') {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else {
        nextDate.setMonth(nextDate.getMonth() + 1); // both 按体外算
      }
      dewormingData.next_date = nextDate.toISOString().split('T')[0];
    }

    const deworming = await Deworming.create(dewormingData);

    res.status(201).json({
      code: 201,
      message: '驱虫记录添加成功',
      data: deworming
    });
  } catch (error) {
    console.error('Create deworming error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   PUT /api/v1/dewormings/:id
 * @desc    更新驱虫记录
 * @access  Private
 */
router.put('/:id', [
  param('id', '无效的记录 ID').isInt({ min: 1 }),
  body('type', '驱虫类型必须是 internal/external/both').optional().isIn(['internal', 'external', 'both']),
  body('deworm_date', '日期格式错误').optional().isISO8601(),
  body('next_date', '日期格式错误').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    const dewormingId = parseInt(req.params.id);
    const deworming = await Deworming.findById(dewormingId);

    if (!deworming) {
      return res.status(404).json({
        code: 404,
        message: '驱虫记录不存在'
      });
    }

    // 验证权限
    const pet = await Pet.findById(deworming.pet_id);
    if (!pet || pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权修改此驱虫记录'
      });
    }

    const updatedDeworming = await Deworming.update(dewormingId, req.body);

    res.json({
      code: 200,
      message: '更新成功',
      data: updatedDeworming
    });
  } catch (error) {
    console.error('Update deworming error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   DELETE /api/v1/dewormings/:id
 * @desc    删除驱虫记录
 * @access  Private
 */
router.delete('/:id', [
  param('id', '无效的记录 ID').isInt({ min: 1 })
], async (req, res) => {
  try {
    const dewormingId = parseInt(req.params.id);
    const deworming = await Deworming.findById(dewormingId);

    if (!deworming) {
      return res.status(404).json({
        code: 404,
        message: '驱虫记录不存在'
      });
    }

    // 验证权限
    const pet = await Pet.findById(deworming.pet_id);
    if (!pet || pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权删除此驱虫记录'
      });
    }

    await Deworming.delete(dewormingId);

    res.json({
      code: 200,
      message: '驱虫记录已删除'
    });
  } catch (error) {
    console.error('Delete deworming error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   GET /api/v1/dewormings/pet/:petId/upcoming
 * @desc    获取即将到期的驱虫
 * @access  Private
 */
router.get('/pet/:petId/upcoming', [
  param('petId', '无效的宠物 ID').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    const petId = parseInt(req.params.petId);
    
    // 验证宠物归属
    const pet = await Pet.findById(petId);
    if (!pet || pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权查看此宠物的驱虫信息'
      });
    }

    const upcomingDewormings = await Deworming.findUpcoming(petId);

    res.json({
      code: 200,
      message: 'success',
      data: upcomingDewormings
    });
  } catch (error) {
    console.error('Get upcoming dewormings error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;

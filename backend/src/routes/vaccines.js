/**
 * 疫苗记录路由
 */

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Vaccine = require('../models/Vaccine');
const Pet = require('../models/Pet');

/**
 * @route   GET /api/v1/vaccines
 * @desc    获取疫苗记录列表
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const { pet_id, status } = req.query;
    
    if (pet_id) {
      // 验证宠物归属
      const pet = await Pet.findById(parseInt(pet_id));
      if (!pet || pet.user_id !== req.user.id) {
        return res.status(403).json({
          code: 403,
          message: '无权查看此宠物的疫苗记录'
        });
      }
    }

    const vaccines = await Vaccine.find({ pet_id, status });

    res.json({
      code: 200,
      message: 'success',
      data: vaccines
    });
  } catch (error) {
    console.error('Get vaccines error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   GET /api/v1/vaccines/:id
 * @desc    获取单个疫苗记录详情
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

    const vaccineId = parseInt(req.params.id);
    const vaccine = await Vaccine.findById(vaccineId);

    if (!vaccine) {
      return res.status(404).json({
        code: 404,
        message: '疫苗记录不存在'
      });
    }

    // 验证权限
    const pet = await Pet.findById(vaccine.pet_id);
    if (!pet || pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权查看此疫苗记录'
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: vaccine
    });
  } catch (error) {
    console.error('Get vaccine error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   POST /api/v1/vaccines
 * @desc    添加疫苗记录
 * @access  Private
 */
router.post('/', [
  body('pet_id', '宠物 ID 必填').isInt({ min: 1 }),
  body('vaccine_name', '疫苗名称必填').notEmpty().isLength({ max: 100 }),
  body('vaccine_type', '疫苗类型必须是 core/non-core').optional().isIn(['core', 'non-core']),
  body('vaccine_date', '接种日期必填').isISO8601(),
  body('next_date', '下次日期格式错误').optional().isISO8601(),
  body('hospital_name', '医院名称不能超过 100 字符').optional().isLength({ max: 100 }),
  body('doctor_name', '医生姓名不能超过 50 字符').optional().isLength({ max: 50 }),
  body('batch_number', '批号不能超过 50 字符').optional().isLength({ max: 50 }),
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
        message: '无权为此宠物添加疫苗记录'
      });
    }

    // 自动计算下次接种日期 (如果未提供)
    let vaccineData = { ...req.body };
    if (!vaccineData.next_date && vaccineData.vaccine_date) {
      const vaccineDate = new Date(vaccineData.vaccine_date);
      const nextDate = new Date(vaccineDate);
      // 核心疫苗 1 年，非核心 6 个月
      nextDate.setFullYear(nextDate.getFullYear() + (vaccineData.vaccine_type === 'core' ? 1 : 0.5));
      vaccineData.next_date = nextDate.toISOString().split('T')[0];
    }

    const vaccine = await Vaccine.create(vaccineData);

    res.status(201).json({
      code: 201,
      message: '疫苗记录添加成功',
      data: vaccine
    });
  } catch (error) {
    console.error('Create vaccine error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   PUT /api/v1/vaccines/:id
 * @desc    更新疫苗记录
 * @access  Private
 */
router.put('/:id', [
  param('id', '无效的记录 ID').isInt({ min: 1 }),
  body('vaccine_name', '疫苗名称不能超过 100 字符').optional().isLength({ max: 100 }),
  body('vaccine_date', '日期格式错误').optional().isISO8601(),
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

    const vaccineId = parseInt(req.params.id);
    const vaccine = await Vaccine.findById(vaccineId);

    if (!vaccine) {
      return res.status(404).json({
        code: 404,
        message: '疫苗记录不存在'
      });
    }

    // 验证权限
    const pet = await Pet.findById(vaccine.pet_id);
    if (!pet || pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权修改此疫苗记录'
      });
    }

    const updatedVaccine = await Vaccine.update(vaccineId, req.body);

    res.json({
      code: 200,
      message: '更新成功',
      data: updatedVaccine
    });
  } catch (error) {
    console.error('Update vaccine error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   DELETE /api/v1/vaccines/:id
 * @desc    删除疫苗记录
 * @access  Private
 */
router.delete('/:id', [
  param('id', '无效的记录 ID').isInt({ min: 1 })
], async (req, res) => {
  try {
    const vaccineId = parseInt(req.params.id);
    const vaccine = await Vaccine.findById(vaccineId);

    if (!vaccine) {
      return res.status(404).json({
        code: 404,
        message: '疫苗记录不存在'
      });
    }

    // 验证权限
    const pet = await Pet.findById(vaccine.pet_id);
    if (!pet || pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权删除此疫苗记录'
      });
    }

    await Vaccine.delete(vaccineId);

    res.json({
      code: 200,
      message: '疫苗记录已删除'
    });
  } catch (error) {
    console.error('Delete vaccine error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   GET /api/v1/vaccines/pet/:petId/upcoming
 * @desc    获取即将到期的疫苗
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
        message: '无权查看此宠物的疫苗信息'
      });
    }

    const upcomingVaccines = await Vaccine.findUpcoming(petId);

    res.json({
      code: 200,
      message: 'success',
      data: upcomingVaccines
    });
  } catch (error) {
    console.error('Get upcoming vaccines error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;

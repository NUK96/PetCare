/**
 * 宠物路由
 * 宠物信息管理
 */

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Pet = require('../models/Pet');

/**
 * @route   GET /api/v1/pets
 * @desc    获取当前用户的宠物列表
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

    const pets = await Pet.findByUserId(userId);

    res.json({
      code: 200,
      message: 'success',
      data: pets
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   GET /api/v1/pets/:id
 * @desc    获取单个宠物详情
 * @access  Private
 */
router.get('/:id', [
  param('id', '无效的宠物 ID').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    const petId = parseInt(req.params.id);
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        code: 404,
        message: '宠物不存在'
      });
    }

    // 验证权限
    if (pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权查看此宠物信息'
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: pet
    });
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   POST /api/v1/pets
 * @desc    创建新宠物
 * @access  Private
 */
router.post('/', [
  body('name', '宠物名字必填').notEmpty().isLength({ max: 50 }),
  body('species', '物种必须是 cat/dog/other').isIn(['cat', 'dog', 'other']),
  body('breed', '品种不能超过 50 个字符').optional().isLength({ max: 50 }),
  body('birthday', '日期格式错误').optional().isISO8601(),
  body('gender', '性别必须是 male/female/unknown').optional().isIn(['male', 'female', 'unknown']),
  body('weight', '体重必须是数字').optional().isFloat({ min: 0, max: 100 }),
  body('neutered', '绝育状态必须是布尔值').optional().isBoolean(),
  body('allergy', '过敏史不能超过 500 字符').optional().isLength({ max: 500 }),
  body('medical_history', '病史不能超过 500 字符').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    const petData = {
      ...req.body,
      user_id: req.user.id,
      is_default: false
    };

    // 如果是用户的第一只宠物，设为默认
    const existingPets = await Pet.findByUserId(req.user.id);
    if (existingPets.length === 0) {
      petData.is_default = true;
    }

    const pet = await Pet.create(petData);

    res.status(201).json({
      code: 201,
      message: '宠物创建成功',
      data: pet
    });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   PUT /api/v1/pets/:id
 * @desc    更新宠物信息
 * @access  Private
 */
router.put('/:id', [
  param('id', '无效的宠物 ID').isInt({ min: 1 }),
  body('name', '宠物名字不能超过 50 个字符').optional().isLength({ max: 50 }),
  body('breed', '品种不能超过 50 个字符').optional().isLength({ max: 50 }),
  body('birthday', '日期格式错误').optional().isISO8601(),
  body('weight', '体重必须是数字').optional().isFloat({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errors.array()
      });
    }

    const petId = parseInt(req.params.id);
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        code: 404,
        message: '宠物不存在'
      });
    }

    // 验证权限
    if (pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权修改此宠物信息'
      });
    }

    const updatedPet = await Pet.update(petId, req.body);

    res.json({
      code: 200,
      message: '更新成功',
      data: updatedPet
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   DELETE /api/v1/pets/:id
 * @desc    删除宠物
 * @access  Private
 */
router.delete('/:id', [
  param('id', '无效的宠物 ID').isInt({ min: 1 })
], async (req, res) => {
  try {
    const petId = parseInt(req.params.id);
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        code: 404,
        message: '宠物不存在'
      });
    }

    // 验证权限
    if (pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权删除此宠物'
      });
    }

    await Pet.delete(petId);

    res.json({
      code: 200,
      message: '宠物已删除'
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

/**
 * @route   PUT /api/v1/pets/:id/default
 * @desc    设为默认宠物
 * @access  Private
 */
router.put('/:id/default', [
  param('id', '无效的宠物 ID').isInt({ min: 1 })
], async (req, res) => {
  try {
    const petId = parseInt(req.params.id);
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        code: 404,
        message: '宠物不存在'
      });
    }

    // 验证权限
    if (pet.user_id !== req.user.id) {
      return res.status(403).json({
        code: 403,
        message: '无权操作此宠物'
      });
    }

    await Pet.setDefaultForUser(req.user.id, petId);

    res.json({
      code: 200,
      message: '已设为默认宠物'
    });
  } catch (error) {
    console.error('Set default pet error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;

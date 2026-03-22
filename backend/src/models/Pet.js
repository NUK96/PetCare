/**
 * 宠物模型
 * 处理宠物相关的数据操作
 */

const db = require('../config/database');

class Pet {
  /**
   * 创建宠物
   */
  static async create(data) {
    const sql = `
      INSERT INTO pets 
      (user_id, name, species, breed, birthday, gender, weight, neutered, allergy, medical_history, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      data.user_id,
      data.name,
      data.species,
      data.breed || null,
      data.birthday || null,
      data.gender || 'unknown',
      data.weight || null,
      data.neutered || false,
      data.allergy || null,
      data.medical_history || null,
      data.avatar || null
    ];
    
    const result = await db.query(sql, params);
    return { id: result[0].insertId, ...data };
  }

  /**
   * 查找用户的宠物列表
   */
  static async findByUserId(userId) {
    const sql = `
      SELECT * FROM pets 
      WHERE user_id = ? 
      ORDER BY is_default DESC, created_at DESC
    `;
    
    return await db.query(sql, [userId]);
  }

  /**
   * 查找单个宠物
   */
  static async findById(id, userId) {
    const sql = `
      SELECT * FROM pets 
      WHERE id = ? AND user_id = ?
    `;
    
    return await db.queryOne(sql, [id, userId]);
  }

  /**
   * 更新宠物信息
   */
  static async update(id, userId, data) {
    const sql = `
      UPDATE pets 
      SET name = ?, breed = ?, weight = ?, neutered = ?, allergy = ?, 
          medical_history = ?, avatar = ?, updated_at = NOW()
      WHERE id = ? AND user_id = ?
    `;
    
    const params = [
      data.name,
      data.breed,
      data.weight,
      data.neutered,
      data.allergy,
      data.medical_history,
      data.avatar,
      id,
      userId
    ];
    
    await db.query(sql, params);
    return await this.findById(id, userId);
  }

  /**
   * 删除宠物
   */
  static async delete(id, userId) {
    const sql = `DELETE FROM pets WHERE id = ? AND user_id = ?`;
    await db.query(sql, [id, userId]);
  }

  /**
   * 设置默认宠物
   */
  static async setAsDefault(id, userId) {
    const sql = `
      UPDATE pets 
      SET is_default = CASE WHEN id = ? THEN TRUE ELSE FALSE END,
          updated_at = NOW()
      WHERE user_id = ?
    `;
    
    await db.query(sql, [id, userId]);
  }
}

module.exports = Pet;

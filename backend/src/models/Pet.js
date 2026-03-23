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
   * 查找单个宠物 (不验证用户)
   */
  static async findById(id) {
    const sql = `SELECT * FROM pets WHERE id = ?`;
    return await db.queryOne(sql, [id]);
  }

  /**
   * 更新宠物信息
   */
  static async update(id, data) {
    const allowedFields = ['name', 'species', 'breed', 'birthday', 'gender', 'weight', 'neutered', 'allergy', 'medical_history', 'avatar', 'is_default'];
    const updates = [];
    const params = [];
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(data[field]);
      }
    }
    
    if (updates.length === 0) {
      return await this.findById(id);
    }
    
    updates.push('updated_at = NOW()');
    params.push(id);
    
    const sql = `UPDATE pets SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(sql, params);
    return await this.findById(id);
  }

  /**
   * 删除宠物
   */
  static async delete(id) {
    const sql = `DELETE FROM pets WHERE id = ?`;
    await db.query(sql, [id]);
  }

  /**
   * 设置用户默认宠物
   */
  static async setDefaultForUser(userId, petId) {
    const sql = `
      UPDATE pets 
      SET is_default = CASE WHEN id = ? THEN TRUE ELSE FALSE END,
          updated_at = NOW()
      WHERE user_id = ?
    `;
    
    await db.query(sql, [petId, userId]);
  }
}

module.exports = Pet;

/**
 * 驱虫记录模型
 */

const db = require('../config/database');

class Deworming {
  /**
   * 创建驱虫记录
   */
  static async create(data) {
    const sql = `
      INSERT INTO dewormings 
      (pet_id, type, product_name, deworm_date, next_date, dosage, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      data.pet_id,
      data.type,
      data.product_name,
      data.deworm_date,
      data.next_date,
      data.dosage || null,
      data.note || null
    ];
    
    const result = await db.query(sql, params);
    return { id: result[0].insertId, ...data };
  }

  /**
   * 查找驱虫记录 (支持过滤)
   */
  static async find(filters = {}) {
    const { pet_id, type } = filters;
    let sql = `SELECT * FROM dewormings WHERE 1=1`;
    const params = [];
    
    if (pet_id) {
      sql += ` AND pet_id = ?`;
      params.push(pet_id);
    }
    
    if (type) {
      sql += ` AND type = ?`;
      params.push(type);
    }
    
    sql += ` ORDER BY deworm_date DESC`;
    
    return await db.query(sql, params);
  }

  /**
   * 查找单个记录
   */
  static async findById(id) {
    const sql = `SELECT * FROM dewormings WHERE id = ?`;
    return await db.queryOne(sql, [id]);
  }

  /**
   * 查找即将到期的驱虫
   */
  static async findUpcoming(petId, days = 30) {
    const sql = `
      SELECT * FROM dewormings 
      WHERE pet_id = ? 
        AND next_date IS NOT NULL
        AND next_date <= DATE_ADD(NOW(), INTERVAL ? DAY)
        AND reminded = FALSE
      ORDER BY next_date ASC
    `;
    
    return await db.query(sql, [petId, days]);
  }

  /**
   * 更新驱虫记录
   */
  static async update(id, data) {
    const allowedFields = ['type', 'product_name', 'deworm_date', 'next_date', 'dosage', 'note', 'reminded'];
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
    
    const sql = `UPDATE dewormings SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(sql, params);
    return await this.findById(id);
  }

  /**
   * 删除驱虫记录
   */
  static async delete(id) {
    const sql = `DELETE FROM dewormings WHERE id = ?`;
    await db.query(sql, [id]);
  }

  /**
   * 标记为已提醒
   */
  static async markAsReminded(id) {
    const sql = `UPDATE dewormings SET reminded = TRUE WHERE id = ?`;
    await db.query(sql, [id]);
  }
}

module.exports = Deworming;

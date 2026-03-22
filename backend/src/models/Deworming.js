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
   * 查找宠物的驱虫记录
   */
  static async findByPetId(petId) {
    const sql = `
      SELECT * FROM dewormings 
      WHERE pet_id = ? 
      ORDER BY deworm_date DESC
    `;
    
    return await db.query(sql, [petId]);
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
  static async update(id, petId, data) {
    const sql = `
      UPDATE dewormings 
      SET type = ?, product_name = ?, deworm_date = ?, 
          next_date = ?, dosage = ?, note = ?, updated_at = NOW()
      WHERE id = ? AND pet_id = ?
    `;
    
    const params = [
      data.type,
      data.product_name,
      data.deworm_date,
      data.next_date,
      data.dosage,
      data.note,
      id,
      petId
    ];
    
    await db.query(sql, params);
    return await this.findById(id, petId);
  }

  /**
   * 查找单个记录
   */
  static async findById(id, petId) {
    const sql = `SELECT * FROM dewormings WHERE id = ? AND pet_id = ?`;
    return await db.queryOne(sql, [id, petId]);
  }

  /**
   * 删除驱虫记录
   */
  static async delete(id, petId) {
    const sql = `DELETE FROM dewormings WHERE id = ? AND pet_id = ?`;
    await db.query(sql, [id, petId]);
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

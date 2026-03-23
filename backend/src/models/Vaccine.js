/**
 * 疫苗记录模型
 */

const db = require('../config/database');

class Vaccine {
  /**
   * 创建疫苗记录
   */
  static async create(data) {
    const sql = `
      INSERT INTO vaccines 
      (pet_id, vaccine_name, vaccine_type, vaccine_date, next_date, 
       hospital_name, doctor_name, batch_number, note, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      data.pet_id,
      data.vaccine_name,
      data.vaccine_type || 'core',
      data.vaccine_date,
      data.next_date,
      data.hospital_name || null,
      data.doctor_name || null,
      data.batch_number || null,
      data.note || null,
      data.photo || null
    ];
    
    const result = await db.query(sql, params);
    return { id: result[0].insertId, ...data };
  }

  /**
   * 查找疫苗记录 (支持过滤)
   */
  static async find(filters = {}) {
    const { pet_id, status } = filters;
    let sql = `SELECT * FROM vaccines WHERE 1=1`;
    const params = [];
    
    if (pet_id) {
      sql += ` AND pet_id = ?`;
      params.push(pet_id);
    }
    
    if (status === 'upcoming') {
      sql += ` AND next_date IS NOT NULL AND next_date <= DATE_ADD(NOW(), INTERVAL 30 DAY)`;
    } else if (status === 'overdue') {
      sql += ` AND next_date IS NOT NULL AND next_date < NOW()`;
    }
    
    sql += ` ORDER BY vaccine_date DESC`;
    
    return await db.query(sql, params);
  }

  /**
   * 查找单个记录
   */
  static async findById(id) {
    const sql = `SELECT * FROM vaccines WHERE id = ?`;
    return await db.queryOne(sql, [id]);
  }

  /**
   * 查找即将到期的疫苗
   */
  static async findUpcoming(petId, days = 30) {
    const sql = `
      SELECT * FROM vaccines 
      WHERE pet_id = ? 
        AND next_date IS NOT NULL
        AND next_date <= DATE_ADD(NOW(), INTERVAL ? DAY)
        AND reminded = FALSE
      ORDER BY next_date ASC
    `;
    
    return await db.query(sql, [petId, days]);
  }

  /**
   * 更新疫苗记录
   */
  static async update(id, data) {
    const allowedFields = ['vaccine_name', 'vaccine_type', 'vaccine_date', 'next_date', 'hospital_name', 'doctor_name', 'batch_number', 'note', 'photo', 'reminded'];
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
    
    const sql = `UPDATE vaccines SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(sql, params);
    return await this.findById(id);
  }

  /**
   * 删除疫苗记录
   */
  static async delete(id) {
    const sql = `DELETE FROM vaccines WHERE id = ?`;
    await db.query(sql, [id]);
  }

  /**
   * 标记为已提醒
   */
  static async markAsReminded(id) {
    const sql = `UPDATE vaccines SET reminded = TRUE WHERE id = ?`;
    await db.query(sql, [id]);
  }
}

module.exports = Vaccine;

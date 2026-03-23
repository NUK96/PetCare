/**
 * 用户模型
 */

const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * 创建用户
   */
  static async create(data) {
    const sql = `
      INSERT INTO users (openid, unionid, phone, nickname, avatar)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const params = [
      data.openid,
      data.unionid || null,
      data.phone || null,
      data.nickname || null,
      data.avatar || null
    ];
    
    const result = await db.query(sql, params);
    return { id: result[0].insertId, ...data };
  }

  /**
   * 根据 openid 查找用户
   */
  static async findByOpenId(openid) {
    const sql = `SELECT * FROM users WHERE openid = ?`;
    return await db.queryOne(sql, [openid]);
  }

  /**
   * 更新用户信息
   */
  static async update(id, data) {
    const allowedFields = ['nickname', 'avatar', 'phone'];
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
    
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(sql, params);
    return await this.findById(id);
  }

  /**
   * 删除用户
   */
  static async delete(id) {
    const sql = `DELETE FROM users WHERE id = ?`;
    await db.query(sql, [id]);
  }

  /**
   * 查找单个用户
   */
  static async findById(id) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    return await db.queryOne(sql, [id]);
  }

  /**
   * 设置会员等级
   */
  static async setVipLevel(id, level, expireAt) {
    const sql = `
      UPDATE users 
      SET vip_level = ?, vip_expire_at = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    await db.query(sql, [level, expireAt, id]);
  }

  /**
   * 检查会员状态
   */
  static async checkVipStatus(id) {
    const user = await this.findById(id);
    if (!user) return false;
    
    if (user.vip_level === 0) return false;
    if (!user.vip_expire_at) return true;
    
    return new Date(user.vip_expire_at) > new Date();
  }
}

module.exports = User;

/**
 * SQLite 数据库配置 (用于快速部署和测试)
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../petcare.db');
const db = new Database(dbPath);

// 启用外键
db.pragma('foreign_keys = ON');

// 创建表
db.exec(`
  -- 用户表
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openid TEXT UNIQUE NOT NULL,
    unionid TEXT,
    phone TEXT,
    nickname TEXT,
    avatar TEXT,
    vip_level INTEGER DEFAULT 0,
    vip_expire_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 宠物表
  CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    species TEXT CHECK(species IN ('cat', 'dog', 'other')) DEFAULT 'cat',
    breed TEXT,
    birthday DATE,
    gender TEXT CHECK(gender IN ('male', 'female', 'unknown')) DEFAULT 'unknown',
    weight DECIMAL(5,2),
    neutered BOOLEAN DEFAULT 0,
    allergy TEXT,
    medical_history TEXT,
    avatar TEXT,
    is_default BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- 疫苗记录表
  CREATE TABLE IF NOT EXISTS vaccines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER NOT NULL,
    vaccine_name TEXT NOT NULL,
    vaccine_type TEXT CHECK(vaccine_type IN ('core', 'non-core')) DEFAULT 'core',
    vaccine_date DATE NOT NULL,
    next_date DATE,
    hospital_name TEXT,
    doctor_name TEXT,
    batch_number TEXT,
    note TEXT,
    photo TEXT,
    reminded BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
  );

  -- 驱虫记录表
  CREATE TABLE IF NOT EXISTS dewormings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('internal', 'external', 'both')) NOT NULL,
    product_name TEXT,
    deworm_date DATE NOT NULL,
    next_date DATE,
    dosage TEXT,
    note TEXT,
    reminded BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
  );

  -- 健康记录表
  CREATE TABLE IF NOT EXISTS health_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER NOT NULL,
    record_type TEXT CHECK(record_type IN ('weight', 'illness', 'medicine', 'checkup', 'symptom')) NOT NULL,
    record_date DATE NOT NULL,
    weight DECIMAL(5,2),
    temperature DECIMAL(4,1),
    diagnosis TEXT,
    prescription TEXT,
    symptoms TEXT,
    hospital_name TEXT,
    doctor_name TEXT,
    photos TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
  );

  -- 知识库表
  CREATE TABLE IF NOT EXISTS knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT CHECK(category IN ('vaccine', 'deworming', 'diet', 'disease', 'behavior', 'breed')) NOT NULL,
    breed TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT,
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 创建索引
  CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);
  CREATE INDEX IF NOT EXISTS idx_vaccines_pet_id ON vaccines(pet_id);
  CREATE INDEX IF NOT EXISTS idx_dewormings_pet_id ON dewormings(pet_id);
  CREATE INDEX IF NOT EXISTS idx_health_records_pet_id ON health_records(pet_id);
  CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_base(category);
`);

// 插入初始化数据
const initSql = `
  -- 插入测试用户
  INSERT OR IGNORE INTO users (id, openid, nickname, avatar, vip_level) 
  VALUES (1, 'test_openid_001', '测试用户', '', 0);

  -- 插入测试宠物
  INSERT OR IGNORE INTO pets (id, user_id, name, species, breed, birthday, gender, weight, is_default) 
  VALUES 
    (1, 1, '咪咪', 'cat', '英短', '2023-01-15', 'female', 4.5, 1),
    (2, 1, '汪汪', 'dog', '金毛', '2022-06-20', 'male', 25.3, 0);

  -- 插入测试疫苗记录
  INSERT OR IGNORE INTO vaccines (pet_id, vaccine_name, vaccine_type, vaccine_date, next_date, hospital_name)
  VALUES 
    (1, '猫三联', 'core', '2024-03-01', '2025-03-01', '爱心宠物医院'),
    (1, '狂犬疫苗', 'core', '2024-03-15', '2025-03-15', '爱心宠物医院'),
    (2, '犬联苗', 'core', '2024-02-20', '2025-02-20', '阳光动物医院');

  -- 插入测试驱虫记录
  INSERT OR IGNORE INTO dewormings (pet_id, type, product_name, deworm_date, next_date)
  VALUES 
    (1, 'both', '大宠爱', '2024-03-10', '2024-04-10'),
    (2, 'internal', '拜宠清', '2024-03-05', '2024-06-05');

  -- 插入知识库数据
  INSERT OR IGNORE INTO knowledge_base (category, title, content, is_published)
  VALUES 
    ('vaccine', '猫咪疫苗大全', '猫咪核心疫苗包括猫三联和狂犬疫苗。猫三联在 8 周龄开始接种，之后每 3-4 周接种一次，共 3 次。狂犬疫苗在 12 周龄接种。之后每年加强一次。', 1),
    ('vaccine', '狗狗疫苗大全', '狗狗核心疫苗包括犬联苗和狂犬疫苗。犬联苗在 6 周龄开始，每 3-4 周一次，直到 16 周龄。狂犬疫苗在 12 周龄接种。之后每年加强一次。', 1),
    ('deworming', '驱虫知识科普', '驱虫分为体内驱虫和体外驱虫。体内驱虫建议每 3 个月一次，体外驱虫建议每月一次。如果宠物经常外出，建议增加驱虫频率。', 1),
    ('diet', '猫咪饮食禁忌', '猫咪不能吃的食物包括：巧克力、洋葱、大蒜、葡萄、葡萄干、酒精、咖啡因、木糖醇、生肉、生鱼、牛奶（成年猫乳糖不耐受）。', 1),
    ('diet', '狗狗饮食禁忌', '狗狗不能吃的食物包括：巧克力、葡萄/葡萄干、洋葱、大蒜、木糖醇、酒精、咖啡因、夏威夷果、生面团、牛油果。', 1);
`;

try {
  db.exec(initSql);
  console.log('✅ Database tables created and initialized with test data');
} catch (error) {
  console.error('❌ Database initialization error:', error.message);
  throw error;
}

module.exports = {
  query: (sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      if (stmt.reader) {
        return stmt.all(...params);
      } else {
        return stmt.run(...params);
      }
    } catch (error) {
      console.error('DB Query Error:', error.message, sql);
      throw error;
    }
  },
  queryOne: (sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      return stmt.get(...params);
    } catch (error) {
      console.error('DB QueryOne Error:', error.message, sql);
      throw error;
    }
  },
  close: () => db.close()
};

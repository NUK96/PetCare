# PetCare 数据库设计

## 数据库：petcare_db

---

## 表结构

### 1. 用户表 (users)

```sql
CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户 ID',
  `openid` VARCHAR(64) UNIQUE NOT NULL COMMENT '微信 openid',
  `unionid` VARCHAR(64) COMMENT '微信 unionid',
  `phone` VARCHAR(20) COMMENT '手机号',
  `nickname` VARCHAR(50) COMMENT '昵称',
  `avatar` VARCHAR(255) COMMENT '头像 URL',
  `vip_level` TINYINT DEFAULT 0 COMMENT '会员等级 0-普通 1-VIP',
  `vip_expire_at` DATETIME COMMENT '会员过期时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_openid` (`openid`),
  INDEX `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 2. 宠物表 (pets)

```sql
CREATE TABLE `pets` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '宠物 ID',
  `user_id` INT NOT NULL COMMENT '用户 ID',
  `name` VARCHAR(50) NOT NULL COMMENT '宠物名字',
  `species` ENUM('cat', 'dog', 'other') NOT NULL DEFAULT 'cat' COMMENT '物种',
  `breed` VARCHAR(50) COMMENT '品种',
  `birthday` DATE COMMENT '生日',
  `gender` ENUM('male', 'female', 'unknown') DEFAULT 'unknown' COMMENT '性别',
  `weight` DECIMAL(5,2) COMMENT '当前体重 (kg)',
  `neutered` BOOLEAN DEFAULT FALSE COMMENT '是否绝育',
  `allergy` TEXT COMMENT '过敏史',
  `medical_history` TEXT COMMENT '既往病史',
  `avatar` VARCHAR(255) COMMENT '宠物照片 URL',
  `is_default` BOOLEAN DEFAULT FALSE COMMENT '是否默认宠物',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_species` (`species`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物表';
```

### 3. 疫苗记录表 (vaccines)

```sql
CREATE TABLE `vaccines` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '记录 ID',
  `pet_id` INT NOT NULL COMMENT '宠物 ID',
  `vaccine_name` VARCHAR(100) NOT NULL COMMENT '疫苗名称',
  `vaccine_type` ENUM('core', 'non-core') DEFAULT 'core' COMMENT '疫苗类型',
  `vaccine_date` DATE NOT NULL COMMENT '接种日期',
  `next_date` DATE COMMENT '下次接种日期',
  `hospital_name` VARCHAR(100) COMMENT '医院名称',
  `doctor_name` VARCHAR(50) COMMENT '医生姓名',
  `batch_number` VARCHAR(50) COMMENT '疫苗批号',
  `note` TEXT COMMENT '备注',
  `photo` VARCHAR(500) COMMENT '疫苗本照片 URL',
  `reminded` BOOLEAN DEFAULT FALSE COMMENT '是否已提醒',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`pet_id`) REFERENCES `pets`(`id`) ON DELETE CASCADE,
  INDEX `idx_pet_id` (`pet_id`),
  INDEX `idx_next_date` (`next_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='疫苗记录表';
```

### 4. 驱虫记录表 (dewormings)

```sql
CREATE TABLE `dewormings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '记录 ID',
  `pet_id` INT NOT NULL COMMENT '宠物 ID',
  `type` ENUM('internal', 'external', 'both') NOT NULL COMMENT '驱虫类型',
  `product_name` VARCHAR(100) COMMENT '产品名称',
  `deworm_date` DATE NOT NULL COMMENT '驱虫日期',
  `next_date` DATE COMMENT '下次驱虫日期',
  `dosage` VARCHAR(50) COMMENT '用药剂量',
  `note` TEXT COMMENT '备注',
  `reminded` BOOLEAN DEFAULT FALSE COMMENT '是否已提醒',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`pet_id`) REFERENCES `pets`(`id`) ON DELETE CASCADE,
  INDEX `idx_pet_id` (`pet_id`),
  INDEX `idx_next_date` (`next_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='驱虫记录表';
```

### 5. 健康记录表 (health_records)

```sql
CREATE TABLE `health_records` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '记录 ID',
  `pet_id` INT NOT NULL COMMENT '宠物 ID',
  `record_type` ENUM('weight', 'illness', 'medicine', 'checkup', 'symptom') NOT NULL COMMENT '记录类型',
  `record_date` DATE NOT NULL COMMENT '记录日期',
  `weight` DECIMAL(5,2) COMMENT '体重 (kg)',
  `temperature` DECIMAL(4,1) COMMENT '体温 (℃)',
  `diagnosis` TEXT COMMENT '诊断结果',
  `prescription` TEXT COMMENT '处方',
  `symptoms` TEXT COMMENT '症状描述',
  `hospital_name` VARCHAR(100) COMMENT '医院名称',
  `doctor_name` VARCHAR(50) COMMENT '医生姓名',
  `photos` JSON COMMENT '照片 URL 数组',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`pet_id`) REFERENCES `pets`(`id`) ON DELETE CASCADE,
  INDEX `idx_pet_id` (`pet_id`),
  INDEX `idx_record_type` (`record_type`),
  INDEX `idx_record_date` (`record_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='健康记录表';
```

### 6. 提醒表 (reminders)

```sql
CREATE TABLE `reminders` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '提醒 ID',
  `user_id` INT NOT NULL COMMENT '用户 ID',
  `pet_id` INT COMMENT '宠物 ID',
  `reminder_type` ENUM('vaccine', 'deworming', 'weight', 'medicine', 'custom') NOT NULL COMMENT '提醒类型',
  `related_id` INT COMMENT '关联记录 ID',
  `title` VARCHAR(100) NOT NULL COMMENT '提醒标题',
  `content` TEXT COMMENT '提醒内容',
  `remind_at` DATETIME NOT NULL COMMENT '提醒时间',
  `is_sent` BOOLEAN DEFAULT FALSE COMMENT '是否已发送',
  `sent_at` DATETIME COMMENT '发送时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`pet_id`) REFERENCES `pets`(`id`) ON DELETE SET NULL,
  INDEX `idx_remind_at` (`remind_at`),
  INDEX `idx_is_sent` (`is_sent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提醒表';
```

### 7. 知识库表 (knowledge_base)

```sql
CREATE TABLE `knowledge_base` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '知识 ID',
  `category` ENUM('vaccine', 'deworming', 'diet', 'disease', 'behavior', 'breed') NOT NULL COMMENT '分类',
  `breed` VARCHAR(50) COMMENT '适用品种 (NULL 为通用)',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `tags` JSON COMMENT '标签数组',
  `view_count` INT DEFAULT 0 COMMENT '浏览次数',
  `is_published` BOOLEAN DEFAULT FALSE COMMENT '是否发布',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_breed` (`breed`),
  INDEX `idx_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库表';
```

---

## 数据字典

### 疫苗类型 (vaccine_type)
| 值 | 说明 |
|----|------|
| core | 核心疫苗 (必打) |
| non-core | 非核心疫苗 (选打) |

### 常见疫苗
| 宠物类型 | 疫苗名称 | 接种时间 | 下次接种 |
|---------|---------|---------|---------|
| 猫 | 猫三联 | 8 周龄 | 每年 |
| 猫 | 狂犬疫苗 | 12 周龄 | 每年 |
| 狗 | 犬三联 | 6 周龄 | 每年 |
| 狗 | 犬六联 | 8 周龄 | 每年 |
| 狗 | 狂犬疫苗 | 12 周龄 | 每年 |

### 驱虫周期
| 类型 | 周期 | 说明 |
|------|------|------|
| internal | 3 个月 | 体内驱虫 |
| external | 1 个月 | 体外驱虫 |
| both | 3 个月 | 内外同驱 |

---

## 初始化数据

### 疫苗模板数据

```sql
INSERT INTO `knowledge_base` (`category`, `title`, `content`, `is_published`) VALUES
('vaccine', '猫咪疫苗大全', '猫咪核心疫苗包括猫三联和狂犬疫苗...', TRUE),
('vaccine', '狗狗疫苗大全', '狗狗核心疫苗包括犬联苗和狂犬疫苗...', TRUE),
('deworming', '驱虫知识科普', '驱虫分为体内驱虫和体外驱虫...', TRUE),
('diet', '猫咪饮食禁忌', '猫咪不能吃的食物包括巧克力、洋葱...', TRUE),
('diet', '狗狗饮食禁忌', '狗狗不能吃的食物包括巧克力、葡萄...', TRUE);
```

---

## 索引优化建议

1. **查询优化**:
   - `pets.user_id` - 用户查询自己的宠物
   - `vaccines.pet_id` - 查询宠物的疫苗记录
   - `dewormings.pet_id` - 查询宠物的驱虫记录
   - `reminders.remind_at` - 定时任务查询待发送提醒

2. **统计优化**:
   - 考虑添加统计缓存表
   - 定期归档历史数据

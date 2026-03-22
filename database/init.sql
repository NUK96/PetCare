-- PetCare 数据库初始化脚本
-- 创建时间：2026-03-23

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `petcare_db` 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE `petcare_db`;

-- 1. 用户表
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

-- 2. 宠物表
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

-- 3. 疫苗记录表
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

-- 4. 驱虫记录表
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

-- 5. 健康记录表
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

-- 6. 提醒表
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

-- 7. 知识库表
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

-- 插入初始化数据
INSERT INTO `knowledge_base` (`category`, `title`, `content`, `is_published`) VALUES
('vaccine', '猫咪疫苗大全', '猫咪核心疫苗包括猫三联和狂犬疫苗。猫三联在 8 周龄开始接种，之后每 3-4 周接种一次，共 3 次。狂犬疫苗在 12 周龄接种。之后每年加强一次。', TRUE),
('vaccine', '狗狗疫苗大全', '狗狗核心疫苗包括犬联苗和狂犬疫苗。犬联苗在 6 周龄开始，每 3-4 周一次，直到 16 周龄。狂犬疫苗在 12 周龄接种。之后每年加强一次。', TRUE),
('deworming', '驱虫知识科普', '驱虫分为体内驱虫和体外驱虫。体内驱虫建议每 3 个月一次，体外驱虫建议每月一次。如果宠物经常外出，建议增加驱虫频率。', TRUE),
('diet', '猫咪饮食禁忌', '猫咪不能吃的食物包括：巧克力、洋葱、大蒜、葡萄、葡萄干、酒精、咖啡因、木糖醇、生肉、生鱼、牛奶（成年猫乳糖不耐受）。', TRUE),
('diet', '狗狗饮食禁忌', '狗狗不能吃的食物包括：巧克力、葡萄/葡萄干、洋葱、大蒜、木糖醇、酒精、咖啡因、夏威夷果、生面团、牛油果。', TRUE);

-- 创建视图：宠物健康概览
CREATE OR REPLACE VIEW `pet_health_overview` AS
SELECT 
  p.id AS pet_id,
  p.name AS pet_name,
  p.species,
  p.breed,
  p.weight AS current_weight,
  (SELECT COUNT(*) FROM vaccines v WHERE v.pet_id = p.id) AS vaccine_count,
  (SELECT MAX(next_date) FROM vaccines v WHERE v.pet_id = p.id) AS next_vaccine_date,
  (SELECT COUNT(*) FROM dewormings d WHERE d.pet_id = p.id) AS deworming_count,
  (SELECT MIN(next_date) FROM dewormings d WHERE d.pet_id = p.id) AS next_deworming_date,
  (SELECT COUNT(*) FROM health_records h WHERE h.pet_id = p.id) AS health_record_count
FROM pets p;

-- 创建存储过程：自动计算下次疫苗时间
DELIMITER $$
CREATE PROCEDURE `calculate_next_vaccine_date`(
  IN p_vaccine_id INT,
  IN p_vaccine_type VARCHAR(20)
)
BEGIN
  DECLARE v_vaccine_date DATE;
  DECLARE v_next_date DATE;
  
  SELECT vaccine_date INTO v_vaccine_date FROM vaccines WHERE id = p_vaccine_id;
  
  IF p_vaccine_type = 'core' THEN
    SET v_next_date = DATE_ADD(v_vaccine_date, INTERVAL 1 YEAR);
  ELSE
    SET v_next_date = DATE_ADD(v_vaccine_date, INTERVAL 6 MONTH);
  END IF;
  
  UPDATE vaccines SET next_date = v_next_date WHERE id = p_vaccine_id;
END$$
DELIMITER ;

-- 创建触发器：宠物创建时自动生成默认提醒
DELIMITER $$
CREATE TRIGGER `after_pet_insert` 
AFTER INSERT ON pets
FOR EACH ROW
BEGIN
  INSERT INTO reminders (user_id, pet_id, reminder_type, title, content, remind_at)
  VALUES (
    NEW.user_id,
    NEW.id,
    'vaccine',
    CONCAT('给', NEW.name, '接种疫苗'),
    CONCAT('记得带', NEW.name, '去接种疫苗哦！'),
    DATE_ADD(NEW.birthday, INTERVAL 60 DAY)
  );
END$$
DELIMITER ;

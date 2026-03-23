# PetCare 部署指南

**版本**: 1.0.0  
**更新时间**: 2026-03-23  
**部署方式**: Docker Compose

---

## 📋 前置要求

### 服务器配置
- **CPU**: 2 核+
- **内存**: 4GB+
- **存储**: 20GB+
- **系统**: Ubuntu 20.04+ / CentOS 7+

### 软件要求
- Docker 20.10+
- Docker Compose 2.0+
- Git

---

## 🚀 快速部署

### 1. 克隆项目
```bash
git clone https://github.com/NUK96/PetCare.git
cd PetCare
```

### 2. 配置环境变量
```bash
cd backend
cp .env.example .env

# 编辑 .env 文件，配置以下关键变量：
# - MYSQL_PASSWORD: 数据库密码
# - JWT_SECRET: 生成随机密钥
# - WECHAT_APPID: 微信小程序 AppID
# - WECHAT_SECRET: 微信小程序 Secret
```

### 3. 生成 JWT 密钥
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

### 4. 启动服务
```bash
cd docker
docker-compose up -d
```

### 5. 初始化数据库
```bash
docker-compose exec mysql mysql -u root -ppetcare123 petcare_db < ../database/init.sql
```

### 6. 验证部署
```bash
# 检查服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend

# 测试 API
curl http://localhost:3000/api/v1/health
```

---

## 🔧 服务说明

### 容器列表
| 服务 | 端口 | 说明 |
|------|------|------|
| backend | 3000 | Node.js 后端 |
| frontend | 8080 | Nginx 前端 |
| mysql | 3306 | MySQL 数据库 |
| redis | 6379 | Redis 缓存 |

### 数据卷
- `mysql_data`: MySQL 数据持久化
- `redis_data`: Redis 数据持久化
- `backend_logs`: 后端日志

---

## 🔒 安全配置

### 1. 防火墙配置
```bash
# 仅开放必要端口
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 22/tcp    # SSH
ufw enable
```

### 2. SSL 证书配置
```bash
# 使用 Let's Encrypt
certbot --nginx -d yourdomain.com
```

### 3. 数据库安全
- 修改默认密码
- 限制远程访问
- 定期备份

---

## 📊 监控与日志

### 查看日志
```bash
# 后端日志
docker-compose logs -f backend

# 前端日志
docker-compose logs -f frontend

# 数据库日志
docker-compose logs -f mysql
```

### 性能监控
```bash
# 容器资源使用
docker stats

# 系统资源
htop
```

---

## 🔄 更新部署

### 更新代码
```bash
git pull origin main
```

### 重启服务
```bash
docker-compose down
docker-compose up -d
```

### 数据库迁移
```bash
# 如有数据库变更，执行新的 SQL 脚本
docker-compose exec mysql mysql -u root -p petcare_db < migration.sql
```

---

## 🛠️ 故障排查

### 后端无法启动
```bash
# 查看日志
docker-compose logs backend

# 检查环境变量
docker-compose exec backend env

# 测试数据库连接
docker-compose exec backend npm run test:db
```

### 前端无法访问
```bash
# 检查 Nginx 配置
docker-compose exec frontend nginx -t

# 查看访问日志
docker-compose exec frontend tail -f /var/log/nginx/access.log
```

### 数据库连接失败
```bash
# 检查 MySQL 状态
docker-compose exec mysql mysqladmin status -u root -p

# 重启 MySQL
docker-compose restart mysql
```

---

## 📝 备份策略

### 数据库备份
```bash
# 每日备份
docker-compose exec mysql mysqldump -u root -ppetcare123 petcare_db > backup_$(date +%Y%m%d).sql

# 定期清理旧备份
find /backups -name "*.sql" -mtime +7 -delete
```

### 日志备份
```bash
# 每周归档日志
tar -czf logs_$(date +%Y%m%d).tar.gz backend/logs/
```

---

## 🎯 生产环境优化

### 1. 性能优化
- 启用 Redis 缓存
- 配置 CDN 静态资源
- 启用 Gzip 压缩

### 2. 高可用配置
- 数据库主从复制
- 负载均衡
- 自动故障转移

### 3. 安全加固
- 定期更新依赖
- 启用安全审计
- 配置 WAF

---

## 📞 技术支持

- **GitHub Issues**: https://github.com/NUK96/PetCare/issues
- **文档**: /docs 目录
- **日志**: docker-compose logs

---

*部署指南由 AI 助手生成*  
*2026-03-23*

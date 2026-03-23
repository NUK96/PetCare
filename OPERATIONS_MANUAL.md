# PetCare 运维手册

**版本**: 1.0.0  
**更新时间**: 2026-03-23  
**适用环境**: 生产环境

---

## 📋 日常运维清单

### 每日检查
- [ ] 检查服务状态
- [ ] 查看错误日志
- [ ] 监控 CPU/内存使用
- [ ] 检查数据库连接
- [ ] 验证 API 响应时间

### 每周检查
- [ ] 数据库备份验证
- [ ] 日志归档
- [ ] 安全更新检查
- [ ] 性能指标分析
- [ ] 用户反馈处理

### 每月检查
- [ ] 系统更新
- [ ] 依赖升级
- [ ] 安全审计
- [ ] 性能优化
- [ ] 容量规划

---

## 🔧 常用命令

### 服务管理

```bash
# 查看所有服务状态
docker-compose ps

# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 重启特定服务
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
docker-compose restart redis

# 查看服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# 查看最近 100 行日志
docker-compose logs --tail=100 backend
```

### 数据库管理

```bash
# 进入 MySQL 容器
docker-compose exec mysql mysql -u root -p

# 备份数据库
docker-compose exec mysql mysqldump -u root -ppetcare123 petcare_db > backup_$(date +%Y%m%d_%H%M%S).sql

# 恢复数据库
docker-compose exec mysql mysql -u root -ppetcare123 petcare_db < backup_20260323.sql

# 查看数据库大小
docker-compose exec mysql mysql -u root -p -e "SELECT table_schema, SUM(data_length + index_length) / 1024 / 1024 AS 'Size (MB)' FROM information_schema.tables WHERE table_schema = 'petcare_db' GROUP BY table_schema;"

# 查看连接数
docker-compose exec mysql mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"
```

### Redis 管理

```bash
# 进入 Redis 容器
docker-compose exec redis redis-cli

# 查看 Redis 信息
docker-compose exec redis redis-cli INFO

# 查看内存使用
docker-compose exec redis redis-cli INFO memory

# 清空缓存 (谨慎使用)
docker-compose exec redis redis-cli FLUSHALL
```

### 日志管理

```bash
# 查看后端日志
docker-compose logs -f backend | grep ERROR

# 查看访问日志
docker-compose exec frontend tail -f /var/log/nginx/access.log

# 查看错误日志
docker-compose exec frontend tail -f /var/log/nginx/error.log

# 导出日志
docker-compose logs backend > backend_logs_$(date +%Y%m%d).txt
```

---

## 🔍 故障排查

### 后端无法启动

**症状**: 后端容器不断重启

**排查步骤**:
```bash
# 1. 查看日志
docker-compose logs backend

# 2. 检查环境变量
docker-compose exec backend env

# 3. 测试数据库连接
docker-compose exec backend node -e "const db = require('./src/config/database'); db.query('SELECT 1').then(() => console.log('OK')).catch(console.error)"

# 4. 检查端口占用
netstat -tlnp | grep 3000
```

**常见原因**:
- 数据库连接失败
- 端口被占用
- 环境变量缺失
- 依赖未安装

**解决方案**:
```bash
# 重启数据库
docker-compose restart mysql

# 重新安装依赖
docker-compose exec backend npm install

# 检查 .env 文件
cat backend/.env
```

---

### 前端无法访问

**症状**: 502 Bad Gateway 或页面空白

**排查步骤**:
```bash
# 1. 检查 Nginx 配置
docker-compose exec frontend nginx -t

# 2. 查看 Nginx 日志
docker-compose exec frontend tail -f /var/log/nginx/error.log

# 3. 检查后端是否可访问
docker-compose exec frontend curl http://backend:3000/health

# 4. 重启 Nginx
docker-compose restart frontend
```

**常见原因**:
- Nginx 配置错误
- 后端服务不可用
- 静态文件缺失

---

### 数据库连接失败

**症状**: API 返回 500 错误

**排查步骤**:
```bash
# 1. 检查 MySQL 状态
docker-compose exec mysql mysqladmin status -u root -p

# 2. 查看 MySQL 日志
docker-compose logs mysql

# 3. 检查连接数
docker-compose exec mysql mysql -u root -p -e "SHOW PROCESSLIST;"

# 4. 重启 MySQL
docker-compose restart mysql
```

**常见原因**:
- MySQL 未启动
- 连接数已满
- 密码错误
- 网络问题

---

### 性能问题

**症状**: API 响应慢

**排查步骤**:
```bash
# 1. 查看系统资源
docker stats

# 2. 检查慢查询
docker-compose exec mysql mysql -u root -p -e "SHOW FULL PROCESSLIST;"

# 3. 查看 Redis 性能
docker-compose exec redis redis-cli SLOWLOG GET 10

# 4. 分析 API 响应时间
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/v1/health
```

**优化建议**:
- 添加数据库索引
- 启用 Redis 缓存
- 优化慢查询
- 增加服务器资源

---

## 📊 监控指标

### 关键指标

| 指标 | 阈值 | 告警级别 |
|------|------|---------|
| CPU 使用率 | > 80% | ⚠️ 警告 |
| 内存使用率 | > 85% | ⚠️ 警告 |
| 磁盘使用率 | > 90% | 🔴 严重 |
| API 响应时间 | > 500ms | ⚠️ 警告 |
| 错误率 | > 1% | 🔴 严重 |
| 数据库连接数 | > 80% | ⚠️ 警告 |

### 监控命令

```bash
# 查看容器资源使用
docker stats --no-stream

# 查看系统资源
free -h
df -h
top -bn1 | head -20

# 查看网络流量
iftop -i eth0
```

---

## 🔒 安全运维

### 定期更新

```bash
# 更新系统包
apt update && apt upgrade -y

# 更新 Docker 镜像
docker-compose pull

# 更新 Node.js 依赖
docker-compose exec backend npm audit fix
docker-compose exec frontend npm audit fix
```

### 安全扫描

```bash
# 扫描 Docker 镜像漏洞
docker scan petcare-backend

# 扫描依赖漏洞
docker-compose exec backend npm audit
docker-compose exec frontend npm audit
```

### 备份策略

```bash
# 创建备份脚本
cat > /opt/petcare/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/petcare"

# 备份数据库
docker-compose exec mysql mysqldump -u root -ppetcare123 petcare_db > $BACKUP_DIR/db_$DATE.sql

# 备份日志
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz /var/log/petcare/

# 删除 7 天前备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /opt/petcare/backup.sh

# 添加到 crontab (每日凌晨 2 点)
echo "0 2 * * * /opt/petcare/backup.sh" | crontab -
```

---

## 📞 应急联系

### 故障升级流程

1. **一级故障** (服务不可用)
   - 立即重启服务
   - 通知运维负责人
   - 记录故障时间

2. **二级故障** (性能下降)
   - 分析性能瓶颈
   - 优化配置
   - 通知开发团队

3. **三级故障** (数据异常)
   - 立即停止写入
   - 恢复备份
   - 通知所有相关人员

### 联系列表

| 角色 | 联系人 | 联系方式 |
|------|--------|---------|
| 运维负责人 | 待指定 | 待填写 |
| 开发负责人 | AI 助手 | 当前会话 |
| 产品负责人 | 北野武 | 当前会话 |

---

## 📝 变更管理

### 发布流程

1. **准备阶段**
   - 代码审查通过
   - 测试全部通过
   - 备份数据库

2. **发布阶段**
   - 停止服务
   - 更新代码
   - 执行迁移
   - 启动服务

3. **验证阶段**
   - 功能验证
   - 性能验证
   - 监控观察

### 回滚流程

```bash
# 1. 停止服务
docker-compose down

# 2. 恢复代码
git checkout <previous_version>

# 3. 恢复数据库
docker-compose exec mysql mysql -u root -p petcare_db < backup_YYYYMMDD.sql

# 4. 重启服务
docker-compose up -d

# 5. 验证服务
curl http://localhost:3000/health
```

---

*运维手册由 AI 助手生成*  
*2026-03-23 10:10*

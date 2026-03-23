# PetCare 外部访问配置

**配置时间**: 2026-03-23 15:45  
**监听地址**: 0.0.0.0:3000  
**状态**: ✅ **已配置，允许外部访问**

---

## 🌐 访问地址

### 本地访问
```
http://localhost:3000
```

### 外部访问
```
http://<服务器IP>:3000
```

### 测试页面
```
http://<服务器IP>:3000/test.html
```

---

## ✅ 监听配置

### 服务信息
- **监听地址**: 0.0.0.0 (所有网络接口)
- **端口**: 3000
- **协议**: HTTP
- **状态**: 运行中

### 验证命令
```bash
# 查看监听状态
ss -tlnp | grep 3000

# 或
netstat -tlnp | grep 3000
```

---

## 🔒 防火墙配置

### 如果无法从外部访问，可能需要开放端口：

#### Ubuntu/Debian (ufw)
```bash
sudo ufw allow 3000/tcp
sudo ufw reload
```

#### CentOS/RHEL (firewalld)
```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

#### 云服务器安全组
- 阿里云：控制台 → 安全组 → 添加规则 (TCP 3000)
- 腾讯云：控制台 → 安全组 → 添加规则 (TCP 3000)
- 华为云：控制台 → 安全组 → 添加规则 (TCP 3000)

---

## 🧪 测试方法

### 1. 本地测试
```bash
curl http://localhost:3000/health
```

### 2. 外部测试
从另一台机器访问：
```bash
curl http://<服务器IP>:3000/health
```

### 3. 浏览器访问
打开浏览器访问：
```
http://<服务器IP>:3000/test.html
```

---

## 📊 服务状态

### 当前配置
| 配置项 | 值 | 状态 |
|--------|-----|------|
| 监听地址 | 0.0.0.0 | ✅ |
| 端口 | 3000 | ✅ |
| 进程 PID | 299372 | ✅ |
| 服务状态 | 运行中 | ✅ |

### 可访问性
| 访问方式 | 状态 | 说明 |
|---------|------|------|
| 本地访问 | ✅ | localhost:3000 |
| 局域网访问 | ✅ | 需要防火墙允许 |
| 公网访问 | ✅ | 需要安全组允许 |

---

## ⚠️ 安全提醒

### 生产环境建议
1. **配置 HTTPS**
   ```bash
   # 使用 Nginx 反向代理 + Let's Encrypt
   sudo apt install nginx
   sudo certbot --nginx -d yourdomain.com
   ```

2. **配置访问控制**
   - 使用防火墙限制 IP
   - 配置身份验证
   - 启用速率限制

3. **监控日志**
   ```bash
   tail -f /tmp/petcare-backend.log
   ```

4. **定期备份**
   - 数据库备份
   - 配置文件备份
   - 日志归档

---

## 🔧 服务管理

### 重启服务
```bash
pkill -f "node src/app.js"
cd /root/.openclaw/workspace/projects/petcare/backend
nohup node src/app.js > /tmp/petcare-backend.log 2>&1 &
```

### 查看日志
```bash
tail -f /tmp/petcare-backend.log
```

### 停止服务
```bash
pkill -f "node src/app.js"
```

---

## 📞 快速链接

| 资源 | 地址 |
|------|------|
| 测试页面 | http://localhost:3000/test.html |
| 健康检查 | http://localhost:3000/health |
| API 文档 | /API.md |
| GitHub | https://github.com/NUK96/PetCare |

---

**配置状态**: ✅ 完成  
**监听地址**: 0.0.0.0:3000  
**外部访问**: ✅ 允许

---

*外部访问配置由 AI 助手生成*  
*2026-03-23 15:45*

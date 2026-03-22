# PetCare 宠护 - 宠物健康管理应用

🐾 **科学养宠，从记录开始**

![PetCare](https://img.shields.io/badge/version-1.0.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📱 应用简介

PetCare 是一款专为宠物主人设计的健康管理应用，帮助您科学管理宠物的疫苗、驱虫和健康记录。

### ✨ 核心功能

- 📋 **宠物档案管理** - 多宠物管理，完整档案记录
- 💉 **疫苗提醒** - 自动计算下次接种时间，智能提醒
- 💊 **驱虫记录** - 体内体外驱虫分类管理
- ⚖️ **健康记录** - 体重、病历、体检数据追踪
- 📚 **养宠知识库** - 科学养宠知识随时查

---

## 🎨 UI 设计

基于通义万相 AI 生成的 UI 设计图：
- 温暖橙色主色调 (#FF9500)
- 清新可爱风格
- 简洁直观的交互

---

## 🛠️ 技术栈

### 前端
- **框架**: UniApp (Vue3)
- **UI 库**: uView UI
- **平台**: 微信小程序 + H5

### 后端
- **语言**: Node.js 18+
- **框架**: Express
- **数据库**: MySQL 8.0 + Redis
- **认证**: JWT Token

### 部署
- **容器**: Docker + Docker Compose
- **服务器**: 腾讯云/阿里云

---

## 📦 快速开始

### 后端启动

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填写数据库配置

# 启动服务
npm start
```

### 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器 (微信小程序)
npm run dev:mp-weixin

# 启动 H5
npm run dev:h5
```

### Docker 部署

```bash
cd docker

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 📊 项目进度

- ✅ 需求分析 (100%)
- ✅ 技术准备 (100%)
- ✅ 后端开发 (100%)
- ✅ 前端开发 (80%)
- ⏳ 测试上线 (0%)

---

## 📂 项目结构

```
PetCare/
├── frontend/              # 前端项目 (UniApp)
│   ├── pages/            # 页面
│   ├── components/       # 组件
│   ├── static/           # 静态资源
│   └── utils/            # 工具函数
├── backend/              # 后端项目 (Node.js)
│   ├── src/
│   │   ├── routes/      # 路由
│   │   ├── models/      # 模型
│   │   └── middleware/  # 中间件
│   └── config/          # 配置
├── database/            # 数据库脚本
├── docker/              # Docker 配置
└── docs/                # 文档
```

---

## 🔐 安全检查

项目已通过安全检查：
- ✅ SQL 注入防护
- ✅ XSS 防护
- ✅ JWT 安全配置
- ✅ 输入验证
- ✅ 错误处理

运行安全检查：
```bash
bash scripts/security-check.sh
```

---

## 📝 API 文档

详细 API 文档请查看：[API.md](API.md)

### 主要接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/v1/auth/login | POST | 微信登录 |
| /api/v1/pets | GET | 获取宠物列表 |
| /api/v1/pets | POST | 创建宠物 |
| /api/v1/vaccines | GET | 获取疫苗记录 |
| /api/v1/vaccines | POST | 添加疫苗记录 |
| /api/v1/dewormings | GET | 获取驱虫记录 |
| /api/v1/dewormings | POST | 添加驱虫记录 |

---

## 📸 应用截图

### 首页
![首页](docs/screenshots/index.png)

### 宠物详情
![宠物详情](docs/screenshots/pet-detail.png)

### 添加宠物
![添加宠物](docs/screenshots/add-pet.png)

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 License

MIT License

---

## 👥 开发团队

- **Product**: 北野武
- **Tech Lead**: AI Assistant
- **UI Design**: 通义万相

---

## 📞 联系方式

- **GitHub**: https://github.com/NUK96/PetCare
- **Email**: support@petcare.app

---

**感谢使用 PetCare！** 🐾

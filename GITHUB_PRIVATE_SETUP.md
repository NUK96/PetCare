# GitHub 仓库私有化设置指南

**创建时间**: 2026-03-23 10:02  
**仓库**: https://github.com/NUK96/PetCare  
**当前状态**: 需要手动设置为私有

---

## ⚠️ 重要提示

由于当前环境无法直接访问 GitHub CLI，需要您手动将仓库设置为私有。

---

## 🔒 设置步骤

### 方法 1: GitHub 网页界面 (推荐)

1. 打开 https://github.com/NUK96/PetCare
2. 点击 **Settings** (设置) 标签
3. 滚动到页面底部 **Danger Zone** (危险区域)
4. 点击 **Change visibility** (更改可见性)
5. 选择 **Make private** (设为私有)
6. 确认操作

### 方法 2: GitHub CLI

如果您本地安装了 gh CLI：

```bash
gh repo edit NUK96/PetCare --visibility private
```

### 方法 3: GitHub API

```bash
curl -X PATCH \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/NUK96/PetCare \
  -d '{"private":true}'
```

---

## 🔑 生成 GitHub Token

如需使用 API 方式，需要生成 Personal Access Token：

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 选择权限：
   - ✅ `repo` (完整仓库控制)
4. 生成并复制 Token
5. 保存到 `~/.github_token`

---

## ✅ 验证私有化

设置完成后，验证：

1. 访问 https://github.com/NUK96/PetCare
2. 确认页面显示 **Private** 标识
3. 未授权用户无法访问仓库

---

## 📊 当前仓库状态

- **仓库地址**: https://github.com/NUK96/PetCare
- **当前可见性**: ⚠️ 需要设置为私有
- **总提交数**: 30+
- **最后更新**: 2026-03-23 10:00

---

*设置指南由 AI 助手生成*  
*2026-03-23 10:02*

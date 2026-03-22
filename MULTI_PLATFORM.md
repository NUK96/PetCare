# PetCare 多平台发布配置

**更新时间**: 2026-03-23 03:15  
**目标平台**: iOS + Android + 鸿蒙 + 微信小程序 + H5

---

## 📱 平台支持矩阵

| 平台 | 状态 | 预计时间 | 备注 |
|------|------|---------|------|
| **微信小程序** | ✅ 已完成 | 0 天 | 可直接发布 |
| **H5** | ✅ 已完成 | 0 天 | 可直接发布 |
| **Android** | ⏳ 待配置 | 1 天 | UniApp 打包 |
| **iOS** | ⏳ 待配置 | 1 天 | UniApp 打包 + Apple 开发者账号 |
| **鸿蒙** | ⏳ 待适配 | 2-3 天 | 需要鸿蒙插件 |

---

## 🔧 配置步骤

### 1. Android 打包

#### 步骤 1: 配置 manifest.json

```json
{
  "app-plus": {
    "distribute": {
      "android": {
        "package": "com.petcare.app",
        "versionName": "1.0.0",
        "versionCode": "100",
        "minSdkVersion": 21,
        "targetSdkVersion": 30,
        "permissions": [
          "<uses-permission android:name=\"android.permission.CAMERA\"/>",
          "<uses-permission android:name=\"android.permission.READ_EXTERNAL_STORAGE\"/>",
          "<uses-permission android:name=\"android.permission.WRITE_EXTERNAL_STORAGE\"/>",
          "<uses-permission android:name=\"android.permission.INTERNET\"/>",
          "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\"/>"
        ]
      }
    }
  }
}
```

#### 步骤 2: 生成签名证书

```bash
# 生成 keystore
keytool -genkey -v -keystore petcare.keystore -alias petcare -keyalg RSA -keysize 2048 -validity 10000
```

#### 步骤 3: 打包 APK

**云打包** (推荐):
1. 登录：https://dev.dcloud.net.cn/
2. 选择 PetCare 项目
3. 点击"发行" → "原生 App-云打包"
4. 上传签名证书
5. 生成 APK

**本地打包**:
```bash
# 安装 HBuilderX
# 配置 Android SDK
# 点击"发行" → "原生 App-本地打包"
```

---

### 2. iOS 打包

#### 前置条件

- ✅ Apple 开发者账号 ($99/年)
- ✅ macOS 电脑
- ✅ Xcode
- ✅ 证书和描述文件

#### 步骤 1: 配置 manifest.json

```json
{
  "app-plus": {
    "distribute": {
      "ios": {
        "bundleid": "com.petcare.app",
        "versionName": "1.0.0",
        "versionCode": "100",
        "devices": "universal",
        "minimumOsVersion": "12.0",
        "capabilities": {
          "entitlements": {
            "com.apple.developer.associated-domains": []
          }
        }
      }
    }
  }
}
```

#### 步骤 2: 创建证书

1. 登录：https://developer.apple.com/
2. 创建 App ID: `com.petcare.app`
3. 创建 Certificate (Distribution)
4. 创建 Provisioning Profile
5. 下载并安装

#### 步骤 3: 打包 IPA

**云打包** (推荐):
1. 登录：https://dev.dcloud.net.cn/
2. 选择 PetCare 项目
3. 点击"发行" → "原生 App-云打包 (iOS)"
4. 上传证书和描述文件
5. 生成 IPA

**本地打包**:
```bash
# 在 macOS 上使用 HBuilderX
# 配置证书和描述文件
# 点击"发行" → "原生 App-本地打包 (iOS)"
```

#### 步骤 4: 提交 App Store

1. 登录：https://appstoreconnect.apple.com/
2. 创建新 App
3. 上传 IPA
4. 填写应用信息
5. 提交审核 (3-7 天)

---

### 3. 鸿蒙 (HarmonyOS) 适配

#### 方案 1: UniApp 鸿蒙插件 (推荐)

**步骤**:

1. **安装鸿蒙插件**
```bash
cd frontend
npm install @dcloudio/uni-harmony
```

2. **配置 manifest.json**
```json
{
  "app-plus": {
    "distribute": {
      "harmony": {
        "package": "com.petcare.app",
        "versionName": "1.0.0",
        "versionCode": "100",
        "minAPIVersion": 8,
        "permissions": [
          "ohos.permission.CAMERA",
          "ohos.permission.READ_MEDIA",
          "ohos.permission.WRITE_MEDIA",
          "ohos.permission.INTERNET"
        ]
      }
    }
  }
}
```

3. **安装 DevEco Studio**
   - 下载：https://developer.harmonyos.com/
   - 安装并配置

4. **打包 HAP**
```bash
# 使用 HBuilderX
# 点击"发行" → "原生 App-鸿蒙打包"
# 生成 HAP 文件
```

5. **上架鸿蒙应用市场**
   - 登录：https://developer.huawei.com/
   - 创建应用
   - 上传 HAP
   - 提交审核 (3-5 天)

#### 方案 2: Web 应用封装 (备选)

使用 PWA 技术，将 H5 应用封装为鸿蒙应用：

1. 配置 PWA manifest
2. 使用鸿蒙 Web 组件封装
3. 生成 HAP

---

## 📦 应用市场发布清单

### 1. 华为应用市场

**所需材料**:
- [ ] 软件著作权证书 (建议申请)
- [ ] ICP 备案
- [ ] 隐私政策
- [ ] 用户协议
- [ ] 应用截图 (5 张)
- [ ] 应用图标 (512x512)
- [ ] 应用描述 (500 字以内)
- [ ] 测试账号 (如需登录)

**审核时间**: 3-5 天  
**费用**: 免费

### 2. Apple App Store

**所需材料**:
- [ ] Apple 开发者账号 ($99/年)
- [ ] 隐私政策 URL
- [ ] 应用截图 (6.5 寸和 5.5 寸各 5 张)
- [ ] 应用图标 (1024x1024)
- [ ] 应用描述 (英文)
- [ ] 关键词 (100 字符)
- [ ] 分类选择

**审核时间**: 3-7 天  
**费用**: $99/年

### 3. 小米应用商店

**所需材料**:
- [ ] 软件著作权 (可选)
- [ ] ICP 备案
- [ ] 隐私政策
- [ ] 应用截图 (5 张)
- [ ] 应用图标 (512x512)

**审核时间**: 2-3 天  
**费用**: 免费

### 4. OPPO 软件商店

**所需材料**:
- [ ] 软件著作权 (可选)
- [ ] ICP 备案
- [ ] 隐私政策
- [ ] 应用截图 (5 张)

**审核时间**: 2-3 天  
**费用**: 免费

### 5. vivo 应用商店

**所需材料**:
- [ ] 软件著作权 (可选)
- [ ] ICP 备案
- [ ] 隐私政策
- [ ] 应用截图 (5 张)

**审核时间**: 2-3 天  
**费用**: 免费

---

## ⚠️ 注意事项

### 1. 隐私合规

**必须包含**:
- ✅ 隐私政策 (明确收集哪些数据)
- ✅ 用户协议
- ✅ 权限使用说明
- ✅ 第三方 SDK 列表
- ✅ 注销账号功能

### 2. 内容合规

**禁止内容**:
- ❌ 违法违规内容
- ❌ 虚假宣传
- ❌ 侵犯知识产权
- ❌ 恶意竞争

### 3. 技术规范

**必须满足**:
- ✅ 不闪退
- ✅ 无严重 Bug
- ✅ 权限申请合理
- ✅ 隐私政策弹窗
- ✅ 支持深色模式 (推荐)

---

## 📊 发布计划

### 第 1 阶段：准备 (1-2 天)
- [ ] 申请软件著作权 (可选，建议申请)
- [ ] ICP 备案 (如有服务器)
- [ ] 准备应用截图和图标
- [ ] 编写隐私政策和用户协议

### 第 2 阶段：打包 (1 天)
- [ ] Android APK 打包
- [ ] iOS IPA 打包
- [ ] 鸿蒙 HAP 打包

### 第 3 阶段：发布 (3-7 天)
- [ ] 华为应用市场
- [ ] Apple App Store
- [ ] 小米应用商店
- [ ] OPPO 软件商店
- [ ] vivo 应用商店
- [ ] 微信小程序

### 第 4 阶段：推广 (持续)
- [ ] 应用市场优化 (ASO)
- [ ] 用户评价管理
- [ ] 版本迭代更新

---

## 💰 费用预算

| 项目 | 费用 | 周期 |
|------|------|------|
| Apple 开发者账号 | $99/年 | 每年 |
| 软件著作权 | ¥300-500 | 一次性 |
| ICP 备案 | 免费 | 一次性 |
| 服务器 | ¥100-500/月 | 每月 |
| **总计** | **约¥2000/年** | - |

---

## 📞 技术支持

- **UniApp 文档**: https://uniapp.dcloud.net.cn/
- **鸿蒙开发**: https://developer.harmonyos.com/
- **Apple 开发**: https://developer.apple.com/
- **华为开发**: https://developer.huawei.com/

---

**下一步**: 开始多平台打包和发布准备！

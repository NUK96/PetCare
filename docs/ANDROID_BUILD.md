# PetCare Android 本地打包指南

**更新时间**: 2026-03-23 03:30  
**目标**: 生成本地 APK 安装包

---

## 📋 前置条件

### 必需软件

1. **HBuilderX** (推荐)
   - 下载：https://www.dcloud.io/hbuilderx.html
   - 版本：3.0+

2. **Android Studio**
   - 下载：https://developer.android.com/studio
   - 版本：2020.3.1+

3. **Java JDK**
   - 版本：JDK 8 或 JDK 11
   - 下载：https://www.oracle.com/java/technologies/javase-downloads.html

4. **Android SDK**
   - 通过 Android Studio 安装
   - 需要组件：
     - Android SDK Platform 30
     - Android SDK Build-Tools 30.0.3
     - Android Emulator (可选)

---

## 🔑 步骤 1: 生成签名证书

### 使用 keytool 生成

```bash
# 创建证书目录
mkdir -p ~/certificates/petcare
cd ~/certificates/petcare

# 生成 keystore
keytool -genkey -v \
  -keystore petcare.keystore \
  -alias petcare \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 按提示输入：
# - 姓名：Your Name
# - 组织单位：PetCare Team
# - 组织：PetCare
# - 城市：Beijing
# - 省份：Beijing
# - 国家：CN
# - 密钥库密码：(设置一个安全密码)
# - 确认密码
```

### 证书信息保存

**请妥善保管以下信息**：
```
密钥库路径：~/certificates/petcare/petcare.keystore
密钥库密码：********
别名：petcare
密钥密码：********
有效期：10000 天 (约 27 年)
```

---

## ⚙️ 步骤 2: 配置 HBuilderX

### 2.1 安装 HBuilderX

1. 下载并安装 HBuilderX
2. 启动 HBuilderX
3. 登录 DCloud 账号 (没有则注册)

### 2.2 配置 Android SDK

1. 打开 HBuilderX
2. 菜单 → 工具 → 设置
3. 找到 "运行配置"
4. 配置 Android SDK 路径：
   ```
   Android SDK 路径：/path/to/Android/sdk
   JDK 路径：/path/to/jdk
   ```

### 2.3 配置签名证书

1. 菜单 → 工具 → 设置
2. 找到 "原生 App 云打包"
3. 点击 "Android 签名配置"
4. 点击 "添加"
5. 填写信息：
   ```
   证书别名：petcare
   证书路径：/path/to/petcare.keystore
   证书密码：********
   私钥密码：********
   ```
6. 点击 "确定"

---

## 📦 步骤 3: 本地打包

### 3.1 打开项目

1. 启动 HBuilderX
2. 文件 → 打开目录
3. 选择：`/root/.openclaw/workspace/projects/petcare/frontend`

### 3.2 配置 manifest.json

**已配置完成**，检查以下配置：

```json
{
  "app-plus": {
    "distribute": {
      "android": {
        "package": "com.petcare.app",
        "versionName": "1.0.0",
        "versionCode": "100",
        "minSdkVersion": 21,
        "targetSdkVersion": 30
      }
    }
  }
}
```

### 3.3 开始打包

#### 方式 A: 原生 App-本地打包 (推荐)

1. 菜单 → 发行 → 原生 App-本地打包 → 生成本地安装包
2. 选择签名证书：petcare
3. 选择打包类型：
   - **离线打包**: 需要配置离线 SDK
   - **云打包**: 使用 DCloud 云服务器 (推荐)
4. 点击 "打包"
5. 等待打包完成 (约 5-10 分钟)
6. 下载 APK

#### 方式 B: 原生 App-云打包

1. 菜单 → 发行 → 原生 App-云打包
2. 选择签名证书：petcare
3. 选择打包类型：正式包
4. 点击 "打包"
5. 等待打包完成
6. 下载 APK

### 3.4 获取 APK

打包完成后，APK 文件位置：
```
/root/.openclaw/workspace/projects/petcare/frontend/unpackage/dist/app-release.apk
```

---

## 🧪 步骤 4: 测试安装

### 在模拟器测试

1. 启动 Android 模拟器
2. 拖拽 APK 到模拟器
3. 安装并运行

### 在真机测试

1. 手机开启"开发者选项"
2. 开启"USB 调试"
3. 连接电脑
4. 使用 ADB 安装：
   ```bash
   adb install /path/to/app-release.apk
   ```
5. 或在手机上直接打开 APK 安装

---

## 📊 打包配置详情

### Android 权限配置

已在 `manifest.json` 中配置：

```json
{
  "permissions": [
    "<uses-permission android:name=\"android.permission.CAMERA\"/>",
    "<uses-permission android:name=\"android.permission.READ_EXTERNAL_STORAGE\"/>",
    "<uses-permission android:name=\"android.permission.WRITE_EXTERNAL_STORAGE\"/>",
    "<uses-permission android:name=\"android.permission.INTERNET\"/>",
    "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\"/>",
    "<uses-permission android:name=\"android.permission.ACCESS_WIFI_STATE\"/>"
  ]
}
```

### ABI 架构支持

```json
{
  "abiFilters": [
    "armeabi-v7a",  // 兼容老设备
    "arm64-v8a"     // 主流 64 位设备
  ]
}
```

---

## ⚠️ 常见问题

### 问题 1: 打包失败

**错误**: "签名证书无效"

**解决**:
1. 检查证书路径是否正确
2. 检查密码是否正确
3. 重新生成证书

### 问题 2: 安装失败

**错误**: "解析包时出现问题"

**解决**:
1. 检查 Android 版本是否 >= 5.0 (minSdkVersion: 21)
2. 检查 APK 是否完整下载
3. 重新打包

### 问题 3: 应用闪退

**解决**:
1. 查看 logcat 日志
2. 检查权限是否授予
3. 检查后端 API 是否可访问

---

## 📈 打包优化

### 减小 APK 体积

1. **代码压缩**
   ```json
   {
     "minified": true
   }
   ```

2. **资源压缩**
   - 使用 WebP 格式图片
   - 移除未使用资源

3. **分包加载**
   - 将大型资源分包
   - 按需加载

### 提高启动速度

1. **优化首屏**
   - 减少首屏资源
   - 使用启动图

2. **延迟加载**
   - 非关键功能延迟初始化

---

## 🔐 安全建议

### 证书安全

1. **备份证书**
   ```bash
   cp petcare.keystore /secure/backup/location/
   ```

2. **不要提交到 Git**
   ```bash
   # .gitignore
   *.keystore
   *.jks
   ```

3. **使用环境变量存储密码**
   ```bash
   export PETCARE_KEYSTORE_PASSWORD=********
   ```

### 代码安全

1. **代码混淆** (可选)
2. **API 密钥加密**
3. **HTTPS 通信**

---

## 📞 技术支持

- **HBuilderX 文档**: https://hx.dcloud.net.cn/
- **UniApp 文档**: https://uniapp.dcloud.net.cn/
- **DCloud 论坛**: https://ask.dcloud.net.cn/

---

**下一步**: 完成 Android 打包后，继续鸿蒙打包！🚀

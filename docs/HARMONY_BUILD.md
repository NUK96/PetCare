# PetCare 鸿蒙本地打包指南

**更新时间**: 2026-03-23 03:30  
**目标**: 生成本地 HAP 安装包

---

## 📋 前置条件

### 必需软件

1. **DevEco Studio**
   - 下载：https://developer.harmonyos.com/cn/develop/deveco-studio
   - 版本：3.0+
   - 操作系统：Windows/Mac/Linux

2. **Node.js**
   - 版本：14.0+
   - 下载：https://nodejs.org/

3. **Ohpm** (鸿蒙包管理器)
   - 随 DevEco Studio 自动安装

4. **UniApp 鸿蒙插件**
   - 通过 npm 安装

---

## ⚙️ 步骤 1: 安装 DevEco Studio

### 1.1 下载安装

1. 访问：https://developer.harmonyos.com/
2. 下载 DevEco Studio
3. 安装并启动

### 1.2 配置 SDK

1. 首次启动会自动下载 SDK
2. 选择 SDK 安装路径
3. 选择 API 版本：API 8+
4. 等待下载完成

### 1.3 配置签名

1. 菜单 → File → Project Structure
2. 选择 "Signing Configs"
3. 点击 "Add"
4. 填写信息：
   ```
   Sign config name: petcare
   Keystore path: (新建或选择)
   Keystore password: ********
   Key alias: petcare
   Key password: ********
   ```
5. 点击 "OK"

---

## 📦 步骤 2: 安装 UniApp 鸿蒙插件

### 2.1 创建鸿蒙项目

```bash
# 创建项目目录
mkdir -p ~/projects/petcare-harmony
cd ~/projects/petcare-harmony

# 初始化项目
ohpm init
```

### 2.2 安装插件

```bash
# 安装 UniApp 鸿蒙运行时
ohpm install @dcloudio/uni-harmony

# 安装必要依赖
ohpm install @dcloudio/uni-components
ohpm install @dcloudio/uni-mp-harmony
```

### 2.3 配置项目

创建 `build-profile.json5`:

```json5
{
  "app": {
    "signingConfigs": [
      {
        "name": "petcare",
        "type": "HarmonyOS",
        "material": "petcare.p12",
        "certpath": "petcare.cer",
        "keyAlias": "petcare",
        "keyAliasPwd": "********",
        "storePwd": "********"
      }
    ],
    "products": [
      {
        "name": "default",
        "signingConfig": "petcare",
        "compatibleSdkVersion": "API 8",
        "runtimeOS": "HarmonyOS"
      }
    ]
  },
  "modules": [
    {
      "name": "entry",
      "srcPath": "./entry",
      "targets": [
        {
          "name": "default",
          "applyToProducts": [
            "default"
          ]
        }
      ]
    }
  ]
}
```

---

## 📁 步骤 3: 配置项目结构

### 3.1 创建目录结构

```
petcare-harmony/
├── entry/                  # 主模块
│   ├── src/
│   │   └── main/
│   │       ├── ets/       # 代码
│   │       ├── resources/ # 资源
│   │       └── module.json5
│   └── build-profile.json5
├── frontend/              # UniApp 代码
│   └── (复制 frontend 目录)
├── build-profile.json5
└── oh-package.json5
```

### 3.2 复制 UniApp 代码

```bash
# 复制前端代码
cp -r /root/.openclaw/workspace/projects/petcare/frontend/* \
      ~/projects/petcare-harmony/frontend/

# 修改 manifest.json 中的鸿蒙配置
```

---

## 🔧 步骤 4: 配置鸿蒙权限

### 4.1 修改 module.json5

```json5
{
  "module": {
    "name": "entry",
    "type": "entry",
    "description": "$string:module_desc",
    "mainElement": "EntryAbility",
    "deviceTypes": [
      "phone",
      "tablet"
    ],
    "deliveryWithInstall": true,
    "installationFree": false,
    "pages": "$profile:main_pages",
    "abilities": [
      {
        "name": "EntryAbility",
        "srcEntry": "./ets/entryability/EntryAbility.ets",
        "description": "$string:EntryAbility_desc",
        "icon": "$media:icon",
        "label": "$string:EntryAbility_label",
        "startWindowIcon": "$media:icon",
        "startWindowBackground": "$color:start_window_background",
        "exported": true,
        "skills": [
          {
            "entities": [
              "entity.system.home"
            ],
            "actions": [
              "action.system.home"
            ]
          }
        ]
      }
    ],
    "requestPermissions": [
      {
        "name": "ohos.permission.CAMERA",
        "reason": "$string:camera_reason",
        "usedScene": {
          "abilities": [
            "EntryAbility"
          ],
          "when": "inuse"
        }
      },
      {
        "name": "ohos.permission.READ_MEDIA",
        "reason": "$string:read_media_reason",
        "usedScene": {
          "abilities": [
            "EntryAbility"
          ],
          "when": "inuse"
        }
      },
      {
        "name": "ohos.permission.WRITE_MEDIA",
        "reason": "$string:write_media_reason",
        "usedScene": {
          "abilities": [
            "EntryAbility"
          ],
          "when": "inuse"
        }
      },
      {
        "name": "ohos.permission.INTERNET",
        "reason": "$string:internet_reason",
        "usedScene": {
          "abilities": [
            "EntryAbility"
          ],
          "when": "always"
        }
      }
    ]
  }
}
```

### 4.2 添加资源字符串

在 `resources/base/element/string.json` 中添加：

```json
{
  "string": [
    {
      "name": "camera_reason",
      "value": "用于拍摄宠物照片"
    },
    {
      "name": "read_media_reason",
      "value": "用于选择宠物照片"
    },
    {
      "name": "write_media_reason",
      "value": "用于保存宠物照片"
    },
    {
      "name": "internet_reason",
      "value": "用于网络数据同步"
    }
  ]
}
```

---

## 📦 步骤 5: 本地打包

### 5.1 打开项目

1. 启动 DevEco Studio
2. File → Open
3. 选择：`~/projects/petcare-harmony`

### 5.2 配置签名

1. 菜单 → File → Project Structure
2. 选择 "Signing Configs"
3. 选择 "petcare" 配置
4. 确认密码正确

### 5.3 开始打包

#### 方式 A: 图形界面打包

1. 菜单 → Build → Build Hap(s) / APP(s)
2. 选择 "Build Hap(s)"
3. 选择 "default" 配置
4. 等待打包完成
5. 获取 HAP 文件

#### 方式 B: 命令行打包

```bash
cd ~/projects/petcare-harmony

# 清理构建
npm run clean

# 构建 Release 版本
npm run build:release

# 或构建 Debug 版本
npm run build:debug
```

### 5.4 获取 HAP 文件

打包完成后，HAP 文件位置：
```
~/projects/petcare-harmony/entry/build/default/outputs/default/entry-default-release.hap
```

---

## 🧪 步骤 6: 测试安装

### 在模拟器测试

1. DevEco Studio → Tools → Device Manager
2. 下载并启动 HarmonyOS 模拟器
3. 拖拽 HAP 到模拟器
4. 安装并运行

### 在真机测试

**前置条件**:
1. 鸿蒙设备 (手机/平板)
2. 开启"开发者模式"
3. 开启"USB 调试"

**安装步骤**:

1. 连接设备到电脑
2. DevEco Studio 识别设备
3. 右键 HAP 文件 → Install
4. 或在终端使用:
   ```bash
   hdc install entry-default-release.hap
   ```

---

## ⚠️ 常见问题

### 问题 1: 签名失败

**错误**: "Signing failed"

**解决**:
1. 检查签名配置是否正确
2. 检查证书密码是否正确
3. 重新创建签名配置

### 问题 2: 构建失败

**错误**: "Build failed"

**解决**:
1. 检查依赖是否安装完整
2. 清理构建缓存：`npm run clean`
3. 重新安装依赖：`ohpm install`

### 问题 3: 安装失败

**错误**: "Installation failed"

**解决**:
1. 检查设备是否连接
2. 检查设备是否开启 USB 调试
3. 检查 HAP 是否完整

---

## 📊 打包配置详情

### 鸿蒙权限列表

| 权限 | 用途 | 必需 |
|------|------|------|
| CAMERA | 拍摄宠物照片 | 否 |
| READ_MEDIA | 选择照片 | 否 |
| WRITE_MEDIA | 保存照片 | 否 |
| INTERNET | 网络通信 | 是 |

### 支持设备

- ✅ 鸿蒙手机
- ✅ 鸿蒙平板
- ✅ 鸿蒙手表 (需适配)

---

## 🔐 安全建议

### 证书安全

1. **备份证书**
   ```bash
   cp petcare.p12 /secure/backup/
   cp petcare.cer /secure/backup/
   ```

2. **不要提交到 Git**
   ```bash
   # .gitignore
   *.p12
   *.cer
   *.jks
   ```

### 代码安全

1. **代码混淆**
2. **API 密钥加密**
3. **HTTPS 通信**

---

## 📞 技术支持

- **DevEco Studio 文档**: https://developer.harmonyos.com/cn/docs
- **鸿蒙开发文档**: https://developer.harmonyos.com/cn/docs/documentation/doc-guides
- **鸿蒙论坛**: https://developer.huawei.com/consumer/cn/forum/

---

**下一步**: 完成 Android 和鸿蒙打包后，使用 gstack 进行功能测试！🚀

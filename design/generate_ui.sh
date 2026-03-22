#!/bin/bash

# 通义万相 API 调用脚本
API_KEY="sk-7f84059556ad43238835a9b94de7c108"

# 生成首页 UI
echo "正在生成首页 UI 设计..."
curl -X POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-DashScope-Async: enable" \
  -d '{
    "model": "wanx2.1-turbo",
    "input": {
      "prompt": "手机 App UI 设计，宠物健康管理应用首页，清新可爱风格，温暖的橙色和白色主色调，包含宠物卡片列表、添加宠物按钮、疫苗提醒卡片、驱虫提醒卡片，现代化扁平设计，高清专业 UI 设计稿，Figma 风格"
    },
    "parameters": {
      "size": "1024*1024",
      "n": 1
    }
  }'

echo ""
echo "正在生成宠物详情页 UI 设计..."
curl -X POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-DashScope-Async: enable" \
  -d '{
    "model": "wanx2.1-turbo",
    "input": {
      "prompt": "手机 App UI 设计，宠物详情页面，可爱猫咪照片，基本信息展示，疫苗提醒，驱虫提醒，健康数据，清新橙色风格，现代化扁平设计，高清 UI"
    },
    "parameters": {
      "size": "1024*1024",
      "n": 1
    }
  }'

echo ""
echo "正在生成添加宠物页 UI 设计..."
curl -X POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-DashScope-Async: enable" \
  -d '{
    "model": "wanx2.1-turbo",
    "input": {
      "prompt": "手机 App UI 设计，添加宠物表单页面，照片上传区域，名字输入框，品种选择，生日选择，性别选择，体重输入，清新橙色风格，简洁现代"
    },
    "parameters": {
      "size": "1024*1024",
      "n": 1
    }
  }'

echo ""
echo "UI 设计生成任务已提交，请稍后查看结果..."

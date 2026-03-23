#!/bin/bash
# PetCare API 测试脚本

BASE_URL="http://localhost:3000/api/v1"
TOKEN=""

echo "======================================"
echo "PetCare API 测试"
echo "======================================"

# 1. 健康检查
echo -e "\n[1/8] 健康检查..."
curl -s "$BASE_URL/health" | jq '.'

# 2. 模拟登录 (需要真实微信 code)
echo -e "\n[2/8] 测试登录接口..."
# curl -s -X POST "$BASE_URL/auth/login" \
#   -H "Content-Type: application/json" \
#   -d '{"code":"test_code"}' | jq '.'

# 3. 获取宠物列表 (需要 Token)
echo -e "\n[3/8] 测试宠物列表..."
# curl -s "$BASE_URL/pets" \
#   -H "Authorization: Bearer $TOKEN" | jq '.'

# 4. 创建宠物
echo -e "\n[4/8] 测试创建宠物..."
# curl -s -X POST "$BASE_URL/pets" \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer $TOKEN" \
#   -d '{
#     "name":"测试宠物",
#     "species":"cat",
#     "breed":"英短",
#     "gender":"female"
#   }' | jq '.'

# 5. 获取疫苗列表
echo -e "\n[5/8] 测试疫苗列表..."
# curl -s "$BASE_URL/vaccines" \
#   -H "Authorization: Bearer $TOKEN" | jq '.'

# 6. 创建疫苗记录
echo -e "\n[6/8] 测试创建疫苗记录..."
# curl -s -X POST "$BASE_URL/vaccines" \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer $TOKEN" \
#   -d '{
#     "pet_id":1,
#     "vaccine_name":"猫三联",
#     "vaccine_type":"core",
#     "vaccine_date":"2026-03-23"
#   }' | jq '.'

# 7. 获取知识库列表
echo -e "\n[7/8] 测试知识库列表..."
curl -s "$BASE_URL/knowledge" | jq '.'

# 8. 获取健康记录列表
echo -e "\n[8/8] 测试健康记录列表..."
# curl -s "$BASE_URL/health?pet_id=1" \
#   -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n======================================"
echo "测试完成"
echo "======================================"

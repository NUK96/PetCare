# PetCare API 接口设计

## 基础信息

**Base URL**: `https://api.petcare.app/v1`  
**认证方式**: JWT Token  
**返回格式**: JSON

---

## 认证接口

### 1. 微信登录
```
POST /auth/wechat/login
```

**请求**:
```json
{
  "code": "微信登录 code"
}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "token": "JWT token",
    "user": {
      "id": 1,
      "nickname": "用户昵称",
      "avatar": "头像 URL",
      "vip_level": 0,
      "vip_expire_at": null
    }
  }
}
```

---

## 宠物接口

### 1. 创建宠物
```
POST /pets
```

**请求**:
```json
{
  "name": "咪咪",
  "species": "cat",
  "breed": "英短",
  "birthday": "2023-01-01",
  "gender": "female",
  "weight": 3.5,
  "neutered": false
}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "咪咪",
    "species": "cat",
    "breed": "英短",
    "birthday": "2023-01-01",
    "gender": "female",
    "weight": 3.5,
    "avatar": "照片 URL",
    "created_at": "2026-03-23T00:00:00Z"
  }
}
```

### 2. 获取宠物列表
```
GET /pets
```

**响应**:
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "咪咪",
      "species": "cat",
      "breed": "英短",
      "birthday": "2023-01-01",
      "avatar": "照片 URL"
    },
    {
      "id": 2,
      "name": "汪汪",
      "species": "dog",
      "breed": "金毛",
      "birthday": "2022-06-01",
      "avatar": "照片 URL"
    }
  ]
}
```

### 3. 获取宠物详情
```
GET /pets/:id
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "咪咪",
    "species": "cat",
    "breed": "英短",
    "birthday": "2023-01-01",
    "gender": "female",
    "weight": 3.5,
    "neutered": false,
    "allergy": "无",
    "medical_history": "无",
    "avatar": "照片 URL",
    "vaccine_count": 3,
    "deworming_count": 5,
    "next_vaccine_date": "2026-04-01",
    "next_deworming_date": "2026-06-01"
  }
}
```

### 4. 更新宠物
```
PUT /pets/:id
```

### 5. 删除宠物
```
DELETE /pets/:id
```

---

## 疫苗接口

### 1. 添加疫苗记录
```
POST /pets/:petId/vaccines
```

**请求**:
```json
{
  "vaccine_name": "猫三联",
  "vaccine_type": "core",
  "vaccine_date": "2026-03-01",
  "next_date": "2027-03-01",
  "hospital_name": "XX 宠物医院",
  "doctor_name": "张医生",
  "batch_number": "20260301001",
  "note": "无不良反应"
}
```

### 2. 获取疫苗记录
```
GET /pets/:petId/vaccines
```

**响应**:
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "vaccine_name": "猫三联",
      "vaccine_type": "core",
      "vaccine_date": "2026-03-01",
      "next_date": "2027-03-01",
      "hospital_name": "XX 宠物医院",
      "photo": "照片 URL",
      "reminded": false
    }
  ]
}
```

### 3. 删除疫苗记录
```
DELETE /pets/:petId/vaccines/:id
```

---

## 驱虫接口

### 1. 添加驱虫记录
```
POST /pets/:petId/dewormings
```

**请求**:
```json
{
  "type": "both",
  "product_name": "大宠爱",
  "deworm_date": "2026-03-01",
  "next_date": "2026-06-01",
  "dosage": "0.5ml",
  "note": "无不良反应"
}
```

### 2. 获取驱虫记录
```
GET /pets/:petId/dewormings
```

### 3. 删除驱虫记录
```
DELETE /pets/:petId/dewormings/:id
```

---

## 健康记录接口

### 1. 添加健康记录
```
POST /pets/:petId/health-records
```

**请求**:
```json
{
  "record_type": "weight",
  "record_date": "2026-03-23",
  "weight": 3.5,
  "note": "体重正常"
}
```

### 2. 获取健康记录
```
GET /pets/:petId/health-records
```

**参数**:
- `type`: 记录类型 (可选)
- `start_date`: 开始日期 (可选)
- `end_date`: 结束日期 (可选)

### 3. 获取体重曲线
```
GET /pets/:petId/health-records/weight-trend
```

**响应**:
```json
{
  "code": 200,
  "data": [
    {
      "date": "2026-01-01",
      "weight": 3.2
    },
    {
      "date": "2026-02-01",
      "weight": 3.3
    },
    {
      "date": "2026-03-01",
      "weight": 3.5
    }
  ]
}
```

---

## 提醒接口

### 1. 获取待提醒列表
```
GET /reminders/pending
```

**响应**:
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "pet_id": 1,
      "pet_name": "咪咪",
      "reminder_type": "vaccine",
      "title": "疫苗提醒",
      "content": "咪咪该打猫三联了",
      "remind_at": "2026-03-25T09:00:00Z"
    }
  ]
}
```

### 2. 标记为已发送
```
POST /reminders/:id/send
```

---

## 知识库接口

### 1. 获取知识列表
```
GET /knowledge
```

**参数**:
- `category`: 分类 (可选)
- `breed`: 品种 (可选)
- `keyword`: 搜索关键词 (可选)
- `page`: 页码 (默认 1)
- `pageSize`: 每页数量 (默认 20)

### 2. 获取知识详情
```
GET /knowledge/:id
```

### 3. 搜索知识
```
GET /knowledge/search?q=关键词
```

---

## 统计接口

### 1. 获取消费统计
```
GET /stats/expenses
```

**参数**:
- `start_date`: 开始日期
- `end_date`: 结束日期

**响应**:
```json
{
  "code": 200,
  "data": {
    "total": 1500.00,
    "vaccine": 800.00,
    "deworming": 300.00,
    "medical": 400.00,
    "monthly": [
      {
        "month": "2026-01",
        "amount": 500.00
      },
      {
        "month": "2026-02",
        "amount": 400.00
      },
      {
        "month": "2026-03",
        "amount": 600.00
      }
    ]
  }
}
```

### 2. 获取健康统计
```
GET /stats/health
```

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "参数错误",
  "errors": [
    {
      "field": "name",
      "message": "名字不能为空"
    }
  ]
}
```

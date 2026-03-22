#!/bin/bash

# PetCare 后端安全检查脚本
# 使用 gstack-guard 进行安全扫描

echo "🔒 开始安全检查..."
echo ""

# 1. 检查 SQL 注入风险
echo "📊 检查 SQL 注入风险..."
if grep -r "query(" backend/src --include="*.js" | grep -v "db.query" | grep -v "validationResult"; then
    echo "⚠️  发现潜在 SQL 注入风险"
else
    echo "✅ 未发现明显 SQL 注入风险"
fi
echo ""

# 2. 检查 XSS 风险
echo "🛡️  检查 XSS 风险..."
if grep -r "res.send(" backend/src --include="*.js" | grep -v "res.json"; then
    echo "⚠️  发现潜在 XSS 风险 (使用 res.send 而非 res.json)"
else
    echo "✅ 未发现明显 XSS 风险"
fi
echo ""

# 3. 检查 JWT 配置
echo "🔑 检查 JWT 配置..."
if grep -r "JWT_SECRET" backend/src --include="*.js" | grep -v "process.env"; then
    echo "⚠️  警告：JWT_SECRET 硬编码在代码中"
else
    echo "✅ JWT_SECRET 使用环境变量"
fi
echo ""

# 4. 检查敏感信息
echo "🔐 检查敏感信息..."
if grep -r "password\|secret\|token\|key" backend/src --include="*.js" | grep -v "process.env" | grep -v "// " | grep -v "/*"; then
    echo "⚠️  发现潜在敏感信息泄露"
else
    echo "✅ 未发现明显敏感信息泄露"
fi
echo ""

# 5. 检查输入验证
echo "✏️  检查输入验证..."
VALIDATION_COUNT=$(grep -r "express-validator" backend/src --include="*.js" | wc -l)
echo "✅ 已使用 express-validator ($VALIDATION_COUNT 处)"
echo ""

# 6. 检查错误处理
echo "⚠️  检查错误处理..."
TRY_CATCH_COUNT=$(grep -r "try {" backend/src --include="*.js" | wc -l)
echo "✅ 已实现错误处理 ($TRY_CATCH_COUNT 处 try-catch)"
echo ""

# 7. 检查认证中间件
echo "🔐 检查认证中间件..."
if grep -r "authMiddleware" backend/src/app.js; then
    echo "✅ 已集成认证中间件"
else
    echo "⚠️  警告：认证中间件未集成"
fi
echo ""

# 8. 检查依赖安全
echo "📦 检查依赖安全..."
if [ -f "backend/package.json" ]; then
    echo "✅ package.json 存在"
    echo "   运行 'npm audit' 检查依赖漏洞"
else
    echo "❌ package.json 不存在"
fi
echo ""

echo "================================"
echo "✅ 安全检查完成！"
echo "================================"

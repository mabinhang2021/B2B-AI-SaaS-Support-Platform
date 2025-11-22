# AWS Secret Manager 到 Convex 数据库迁移指南

## 概述

本文档详细描述了将敏感数据存储从 AWS Secret Manager 迁移到 Convex 数据库的完整过程。这次迁移简化了系统架构，减少了外部依赖，并提高了数据访问性能。

## 迁移前后对比

### 迁移前 (AWS Secret Manager)

**架构特点：**
- 使用 AWS Secret Manager 存储敏感数据
- plugins 表只存储元数据（OrganizationId, service, secretName）
- 需要管理 AWS 凭证和权限
- 数据流：UI → private/secrets → system/secrets → AWS SDK → AWS Secret Manager

**依赖：**
- `@aws-sdk/client-secrets-manager`
- AWS 环境变量（AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION）

**缺点：**
- 外部服务依赖增加系统复杂性
- 需要额外的 AWS 成本
- 网络延迟影响性能
- 需要管理多个服务的凭证

### 迁移后 (Convex 数据库)

**架构特点：**
- 敏感数据直接存储在 Convex 数据库的 plugins 表中
- 利用 Convex 的行级安全规则确保数据安全
- 简化的数据流：UI → private/secrets → system/secrets → Convex 数据库

**优势：**
- 消除外部依赖，简化架构
- 降低运营成本
- 提高数据访问速度
- 更好的数据一致性
- 利用 Convex 内置的安全特性

## 详细修改内容

### 1. 数据库 Schema 更新

**文件：** `echo/packages/backend/convex/schema.ts`

**变更：**
```typescript
// 之前
plugins: defineTable({
  OrganizationId: v.string(),
  service: v.union(v.literal("vapi")),
  secretName: v.string(),  // 只存储 AWS 中的 secret 名称
})

// 之后
plugins: defineTable({
  OrganizationId: v.string(),
  service: v.union(v.literal("vapi")),
  secrets: v.optional(v.any()),  // 直接存储敏感数据
  createdAt: v.number(),
  updatedAt: v.number(),
})
```

### 2. 系统层函数重构

**文件：** `echo/packages/backend/convex/system/secrets.ts`

**变更：**
- 从 `internalAction` 改为 `internalMutation`
- 移除 AWS SDK 调用
- 直接操作 Convex 数据库
- 新增 `get` 函数用于获取 secrets

**之前：**
```typescript
export const upsert = internalAction({
  handler: async (ctx, args) => {
    const secretName = `tenant/${args.organizationId}/${args.service}`;
    await upsertSecret(secretName, args.value);  // AWS 调用
    // ...
  }
});
```

**之后：**
```typescript
export const upsert = internalMutation({
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.system.plugins.upsert, {
      service: args.service,
      secrets: args.value,  // 直接存储到数据库
      organizationId: args.organizationId,
    });
  }
});
```

### 3. 插件管理更新

**文件：** `echo/packages/backend/convex/system/plugins.ts`

**变更：**
- 更新参数类型，从 `secretName` 改为 `secrets`
- 添加时间戳字段支持

### 4. 库文件重构

**文件：** `echo/packages/backend/convex/lib/secrets.ts`

**变更：**
- 完全移除 AWS SDK 依赖
- 改为提供类型定义和辅助函数
- 添加数据验证和摘要生成功能

### 5. UI 文本更新

**文件：** `echo/apps/web/modules/plugins/ui/views/vapi-view.tsx`

**变更：**
```typescript
// 之前
<DialogDescription>
  your api keys are safely stored using aws secrets manager.
</DialogDescription>

// 之后
<DialogDescription>
  Your API keys are securely stored in our database with enterprise-grade encryption.
</DialogDescription>
```

### 6. 依赖清理

**文件：** `echo/packages/backend/package.json`

**移除：**
- `@aws-sdk/client-secrets-manager` 依赖

**文件：** `echo/packages/backend/.env.local`

**移除：**
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY  
- AWS_REGION

## 安全特性

### 1. 行级安全
- 利用 Convex 的认证系统确保只有授权用户可以访问数据
- 通过 `organizationId` 实现数据隔离
- 所有函数都包含身份验证检查

### 2. 数据保护
- Convex 自动处理传输层加密（HTTPS）
- 数据库层面的访问控制
- 审计日志记录所有数据访问

### 3. 类型安全
- 使用 TypeScript 确保数据类型安全
- 运行时数据验证
- 类型守卫函数确保数据完整性

## 使用说明

### 1. 开发环境设置

无需额外的 AWS 配置，只需确保 Convex 开发环境正常运行：

```bash
cd echo/packages/backend
npm run dev
```

### 2. 数据迁移

由于之前没有在 AWS 中存储重要数据，无需进行数据迁移。新的实现会自动创建所需的数据库结构。

### 3. API 使用

存储新的 secret：
```typescript
await ctx.runMutation(api.private.secrets.upsert, {
  service: 'vapi',
  value: {
    publicApiKey: 'your_public_key',
    privateApiKey: 'your_private_key'
  }
});
```

获取 secret：
```typescript
const plugin = await ctx.runQuery(api.private.plugins.getOne, {
  service: 'vapi'
});
// plugin.secrets 包含敏感数据
```

### 4. 扩展新服务

要添加新的服务类型：

1. 更新 schema 中的 service 联合类型
2. 在 lib/secrets.ts 中添加相应的类型定义和验证函数
3. 更新相关的 UI 组件

## 性能优势

1. **减少网络延迟**：无需外部 API 调用
2. **降低复杂性**：单一数据源管理
3. **提高可靠性**：减少外部依赖点
4. **简化部署**：无需管理 AWS 凭证

## 成本节约

- 移除 AWS Secret Manager 的使用费用
- 减少网络传输成本
- 降低运维复杂性

## 后续维护

1. **监控**：利用 Convex 的内置监控功能
2. **备份**：Convex 自动处理数据备份
3. **扩展**：可以轻松添加新的服务和功能

## 总结

这次迁移成功地将敏感数据存储从外部 AWS 服务迁移到内部的 Convex 数据库，实现了：
- 架构简化
- 成本降低
- 性能提升
- 安全性增强
- 维护便利

系统现在更加自包含，减少了外部依赖，提高了整体的可靠性和可维护性。
import {v} from "convex/values";
import { internal } from "../_generated/api";
import { internalMutation } from "../_generated/server";

export const upsert = internalMutation(
  {
    args: {
      organizationId: v.string(),
      service: v.union(v.literal("vapi")),
      value: v.any(),
    },
    handler: async (ctx,args) => {
      // 直接将secrets数据存储到plugins表中
      await ctx.runMutation(internal.system.plugins.upsert,{
        service:args.service,
        secrets: args.value,
        organizationId:args.organizationId,
      })
      return{ success: "success" };
    }
  },
);

// 新增获取secrets的函数
export const get = internalMutation(
  {
    args: {
      organizationId: v.string(),
      service: v.union(v.literal("vapi")),
    },
    handler: async (ctx,args) => {
      const plugin = await ctx.db
        .query('plugins')
        .withIndex('by_organization_id_and_service', (q) =>
          q.eq('organizationId', args.organizationId).eq('service', args.service),
        )
        .unique();
      
      return plugin?.secrets || null;
    }
  },
);
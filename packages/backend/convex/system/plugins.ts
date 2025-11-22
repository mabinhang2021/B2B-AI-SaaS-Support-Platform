import { v } from 'convex/values';
import { internalMutation, internalQuery } from '../_generated/server';

export const upsert = internalMutation({
  args: {
    service: v.union(v.literal('vapi')),
    organizationId: v.string(),
    secrets: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existingPlugin = await ctx.db
      .query('plugins')
      .withIndex('by_organization_id_and_service', (q) =>
        q.eq('OrganizationId', args.organizationId).eq('service', args.service),
      )
      .unique();
    if (existingPlugin) {
      await ctx.db.patch(existingPlugin._id, {
        service: args.service,
        secrets: args.secrets,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('plugins', {
        OrganizationId: args.organizationId,
        service: args.service,
        secrets: args.secrets,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});


export const getByOrganizationIdAndService = internalQuery({
    args:{
        organizationId:v.string(),
        service:v.union(v.literal("vapi")),
    },
    handler: async (ctx,args) => {
        return await ctx.db
        .query('plugins')
        .withIndex('by_organization_id_and_service', (q) =>
          q.eq('OrganizationId', args.organizationId).eq('service', args.service),
        )
        .unique();
    } 
})

import { mutation, query } from '../_generated/server';
import { ConvexError, v } from 'convex/values';

export const getOne = query({
  args: {
    service: v.union(v.literal('vapi')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }
    return await ctx.db
      .query('plugins')
      .withIndex('by_organization_id_and_service', (q) =>
        q.eq('organizationId', orgId).eq('service', args.service),
      )
      .unique();
  },
});

export const remove = mutation({
  args: {
    service: v.union(v.literal('vapi')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }
    const existingPlugin = await ctx.db
      .query('plugins')
      .withIndex('by_organization_id_and_service', (q) =>
        q.eq('organizationId', orgId).eq('service', args.service),
      )
      .unique();
    if (!existingPlugin) {
      throw new ConvexError({
        message: 'Plugin not found',
        code: 'NOT_FOUND',
      });
    }
    await ctx.db.delete(existingPlugin._id);
  },
});

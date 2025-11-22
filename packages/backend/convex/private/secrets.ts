import { internal } from '../_generated/api';
import { mutation } from '../_generated/server';
import { ConvexError, v } from 'convex/values';
export const upsert = mutation({
  args: {
    service: v.union(v.literal('vapi')),
    value: v.any(),
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
    //todo:check for subscription
    await ctx.scheduler.runAfter(0,internal.system.secrets.upsert,{
        service: args.service,
        organizationId: orgId,
        value: args.value,
    })
  },
});

import { query } from '../_generated/server';
import { ConvexError, v } from 'convex/values';
export const getOneByConversationId = query({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError('unauthenticated');
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError('organization id missing from user identity');
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new ConvexError({
        code: 'not_found',
        message: 'Conversation not found',
      });
    }
    if (conversation.organizationId !== orgId) {
      throw new ConvexError('Invalid organization access');
    }
    const contactSession = await ctx.db.get(conversation.contactSessionId);
    return contactSession; 
  },
});

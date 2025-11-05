import { stat } from 'fs';
import { mutation, query } from '../_generated/server';
import { ConvexError, v } from 'convex/values';
import { supportAgent } from '../system/ai/agents/supportAgent';
import { saveMessage } from '@convex-dev/agent';

import { components } from '../_generated/api';

export const getOne = query({
  args: {
    conversationId: v.id('conversations'),
    contactSessionId: v.id('contactSessions'),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        message: 'Contact session not found',
        code: 'UNAUTHORIZED',
      });
    }
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new ConvexError({
        message: 'Conversation not found',
        code: 'NOT_FOUND',
      });
    }
    if (conversation.contactSessionId !== session._id) {
      throw new ConvexError({
        message: 'Conversation does not belong to this session',
        code: 'FORBIDDEN',
      });
    }
    return {
      _id: conversation._id,
      status: conversation.status,
      threadId: conversation.threadId,
    };
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id('contactSessions'),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        message: 'Contact session not found',
        code: 'UNAUTHORIZED',
      });
    }

    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.organizationId,
    });

    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: 'assistant',
        content: 'Hello! How can we assist you today?',
      },
    });

    const conversationId = await ctx.db.insert('conversations', {
      threadId,
      organizationId: args.organizationId,
      contactSessionId: session._id,
      status: 'unresolved',
    });
    return conversationId;
  },
});

import { stat } from 'fs';
import { mutation, query } from '../_generated/server';
import { ConvexError, v } from 'convex/values';
import { supportAgent } from '../system/ai/agents/supportAgent';
import { MessageDoc, saveMessage } from '@convex-dev/agent';

import { components } from '../_generated/api';
import { paginationOptsValidator, PaginationResult } from 'convex/server';
import { Doc } from '../_generated/dataModel';

export const getOne = query({
  args: {
    conversationId: v.id('conversations'),
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
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new ConvexError({
        message: 'Conversation not found',
        code: 'not_found',
      });
    }
    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        message: 'Invalid organization',
        code: 'UNAUTHORIZED',
      });
    }
    const contactSession = await ctx.db.get(conversation.contactSessionId);
    if (!contactSession) {
      throw new ConvexError({
        message: 'Contact session not found',
        code: 'not_found',
      });
    }
    return{
      ...conversation,
      contactSession,
    }
  },
});

export const getMany = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('unresolved'),
        v.literal('escalated'),
        v.literal('resolved'),
      ),
    ),
    paginationOpts: paginationOptsValidator,
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
    let conversations: PaginationResult<Doc<'conversations'>>;
    if (args.status) {
      conversations = await ctx.db
        .query('conversations')
        .withIndex('by_status_and_organization_id', (q) =>
          q
            .eq('status', args.status as Doc<'conversations'>['status'])
            .eq('organizationId', orgId),
        )
        .order('desc')
        .paginate(args.paginationOpts);
    } else {
      conversations = await ctx.db
        .query('conversations')
        .withIndex('by_organization_id', (q) => q.eq('organizationId', orgId))
        .order('desc')
        .paginate(args.paginationOpts);
    }
    const conversationsWithAdditionalData = await Promise.all(
      conversations.page.map(async (conversation) => {
        let lastMessage: MessageDoc | null = null;
        const contactSession = await ctx.db.get(conversation.contactSessionId);
        if (!contactSession) {
          return null;
        }
        const messages = await supportAgent.listMessages(ctx, {
          threadId: conversation.threadId,
          paginationOpts: { numItems: 1, cursor: null },
        });
        if (messages.page.length > 0) {
          lastMessage = messages.page[0] ?? null;
        }
        return {
          ...conversation,
          lastMessage,
          contactSession,
        };
      }),
    );
    const validConversations = conversationsWithAdditionalData.filter(
      (conv): conv is NonNullable<typeof conv> => conv !== null,
    );
    return {
      ...conversations,
      page: validConversations,
    };
  },
});

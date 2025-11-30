import { components, internal } from '../_generated/api';
import { action, mutation, query } from '../_generated/server';
import { ConvexError, v } from 'convex/values';
import { supportAgent } from '../system/ai/agents/supportAgent';
import { paginationOptsValidator } from 'convex/server';
import { saveMessage } from '@convex-dev/agent';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { OPERATOR_MESSAGE_ENHANCEMENT_PROMPT } from '../system/ai/constants';

export const enhanceResponse = action({
  args: {
    prompt: v.string(),
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

    const subscription = await ctx.runQuery(
      internal.system.subscriptions.getByOrganizationId,{
        organizationId:orgId
      }
    )
    if(subscription?.status !== "active"){
        throw new ConvexError({
          code:"BAD_REQUEST",
          message:"Not subscribe"
        })
    }

    const response = await generateText({
      model: openai('chatgpt-4o-latest'),
      messages: [
        {
          role: 'system',
          content: OPERATOR_MESSAGE_ENHANCEMENT_PROMPT
        },
        { role: 'user', content: args.prompt },
      ],
    });
    return response.text;
  },
});

export const create = mutation({
  args: {
    prompt: v.string(),
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
        message: 'Conversation not found for the given thread ID.',
        code: 'not_found',
      });
    }
    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        message: 'Invalid organization',
        code: 'UNAUTHORIZED',
      });
    }

    if (conversation.status === 'resolved') {
      throw new ConvexError({
        message: 'conversation resolved',
        code: 'BAD_REQUEST',
      });
    }

    if (conversation.status === 'unresolved') {
      await ctx.db.patch(args.conversationId, { status: 'escalated' });
    }

    //todo:implement subscription check here
    await saveMessage(ctx, components.agent, {
      threadId: conversation.threadId,
      agentName: identity.familyName,
      message: {
        role: 'assistant',
        content: args.prompt,
      },
    });
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),

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
    const conversation = await ctx.db
      .query('conversations')
      .withIndex('by_thread_id', (q) => q.eq('threadId', args.threadId))
      .unique();

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

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });
    return paginated;
  },
});

import { createTool } from '@convex-dev/agent';
import z from 'zod';
import { supportAgent } from '../agents/supportAgent.js';
import { internal } from '../../../_generated/api.js';

export const escalateConversationTool = createTool({
  description: 'escalate a customer support conversation by its thread ID.',
  args: z.object({}),
  handler: async (ctx) => {
  
    if (!ctx.threadId) {
      return 'No thread ID found in context.';
    }
    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    });
    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: 'assistant',
        content: 'The conversation has been escalated.',
      },
    });


    return 'Conversation escalated to a human operator.';
  },
});

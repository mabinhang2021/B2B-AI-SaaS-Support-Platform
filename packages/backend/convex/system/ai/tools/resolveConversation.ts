import { createTool } from '@convex-dev/agent';
import z from 'zod';
import { supportAgent } from '../agents/supportAgent';
import { internal } from '../../../_generated/api';

export const resolveConversationTool = createTool({
  description: 'Resolve a customer support conversation by its thread ID.',
  args: z.object({}),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return 'No thread ID found in context.';
    }
    await ctx.runMutation(internal.system.conversations.resolve, {
      threadId: ctx.threadId,
    });
    await supportAgent.saveMessage(ctx,{
        threadId: ctx.threadId,
        message:{
            role:"assistant",
            content:"The conversation has been resolved."
        }
    })
    return 'Conversation resolved successfully.';
  },
});

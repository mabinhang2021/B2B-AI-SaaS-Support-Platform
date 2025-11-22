import { openai } from '@ai-sdk/openai';
import { createTool } from '@convex-dev/agent';
import z from 'zod';
import { generateText } from 'ai';
import rag from '../rag';
import { supportAgent } from '../agents/supportAgent';
import { internal } from '../../../_generated/api';
import { query } from '../../../_generated/server';
import { SEARCH_INTERPRETER_PROMPT } from '../constants';

export const search = createTool({
  description: 'Search the knowledge base for relevant information.',
  args: z.object({
    query: z
      .string()
      .describe('The search query to find relevant information.'),
  }),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      return 'Missing thread ID.';
    }
    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      { threadId: ctx.threadId },
    );
    if (!conversation) {
      return 'Conversation not found.';
    }
    const orgId = conversation.organizationId;
    const searchResult = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit: 5,
    });
    const contextText = `Found results in ${searchResult.entries
      .map((e) => e.title || null)
      .filter((t) => t !== null)
      .join(', ')}.Here is the content:\n\n${searchResult.text}`;

    const response = await generateText({
      messages: [
        {
          role: 'system',
          content: SEARCH_INTERPRETER_PROMPT
        },
        {
          role: 'user',
          content: `User asked: ${args.query}\n\nSearch results:${contextText}`,
        },
      ],
      model: openai.chat('gpt-5-mini-2025-08-07'),
    });
    

    // await supportAgent.saveMessage(ctx, {
    //   threadId: ctx.threadId,
    //   message: {
    //     role: 'assistant',
    //     content: response.text,
    //   },
    // });
    //waiting for fix agent saveMessage issue

    
    return response.text;
  },
});

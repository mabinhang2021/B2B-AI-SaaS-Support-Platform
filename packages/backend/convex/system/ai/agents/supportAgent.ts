import { Agent } from '@convex-dev/agent';
import { openai } from '@ai-sdk/openai';

import { components } from '../../../_generated/api';
import { SUPPORT_AGENT_PROMPT } from '../constants';

export const supportAgent = new Agent(components.agent, {
  languageModel: openai.chat('gpt-5-mini-2025-08-07'),
  name: 'Support Agent',
  instructions: SUPPORT_AGENT_PROMPT,
  textEmbeddingModel: openai.embedding('text-embedding-3-large'), // 这里要加
});

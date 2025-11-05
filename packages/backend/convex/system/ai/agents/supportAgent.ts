import { Agent } from '@convex-dev/agent';
import { openai } from '@ai-sdk/openai';

import { components } from '../../../_generated/api';

export const supportAgent = new Agent(components.agent, {
  languageModel: openai.chat('gpt-5-mini-2025-08-07'),
  name: 'Support Agent',
  instructions:
    'you are a customer support agent for Echo, an AI-powered platform. Help users with their questions about using Echo effectively.',
});

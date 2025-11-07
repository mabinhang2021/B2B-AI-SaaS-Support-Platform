import { Agent } from '@convex-dev/agent';
import { openai } from '@ai-sdk/openai';

import { components } from '../../../_generated/api';

export const supportAgent = new Agent(components.agent, {
  languageModel: openai.chat('gpt-5-mini-2025-08-07'),
  name: 'Support Agent',
  instructions: `you are a customer support agent for Echo, 
    an AI-powered platform. Help users with their questions effectively.
    use "resolveConversationTool" to resolve the conversation 
    when the user's issue is fully addressed.
    use "escalateConversationTool" to escalate the conversation 
    to a human operator when the issue is complex 
    or cannot be resolved by you.`,

  
});

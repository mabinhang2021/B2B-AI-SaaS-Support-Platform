import { definePlaygroundAPI } from "@convex-dev/agent";
import { components } from "./_generated/api";
import { supportAgent } from "./system/ai/agents/supportAgent"

/**
 * Here we expose the API so the frontend can access it.
 * Authorization is handled by passing up an apiKey that can be generated
 * on the dashboard or via CLI via:
 * npx convex run --component agent apiKeys:issue
 */
export const {
  isApiKeyValid,
  listAgents,
  listUsers,
  listThreads,
  listMessages,
  createThread,
  generateText,
  fetchPromptContext,
} = definePlaygroundAPI(components.agent, {
  agents: [supportAgent],
});
//'j574b7zj4pf53f5a9mqdtp6e1x7vdgcw'
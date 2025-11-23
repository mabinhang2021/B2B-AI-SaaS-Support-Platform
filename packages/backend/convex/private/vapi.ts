import { VapiClient, Vapi } from '@vapi-ai/server-sdk';
import { action } from '../_generated/server';
import { internal } from '../_generated/api';
import { ConvexError } from 'convex/values';
import { isVapiSecretData } from '../lib/secrets';


export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx):Promise<Vapi.PhoneNumberPaginatedResponseResultsItem[]> => {
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: 'vapi',
      },
    );
    if (!plugin) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Vapi plugin not configured',
      });
    }
    const secrets = plugin.secrets;

    const secretData = secrets as {
      privateApiKey: string;
      publicApiKey: string;
    };
    if (!secretData) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Vapi plugin secrets not found',
      });
    }
    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Vapi plugin secrets incomplete',
      });
    }
    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });
    const phoneNumbers = await vapiClient.phoneNumbers.list();
    return phoneNumbers;
  },
});


export const getAssistants = action({
  args: {},
  handler: async (ctx):Promise<Vapi.Assistant[]> => {
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: 'vapi',
      },
    );
    if (!plugin) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Vapi plugin not configured',
      });
    }
    const secrets = plugin.secrets;

    const secretData = secrets as {
      privateApiKey: string;
      publicApiKey: string;
    };
    if (!secretData) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Vapi plugin secrets not found',
      });
    }
    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Vapi plugin secrets incomplete',
      });
    }
    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });
    const assistants = await vapiClient.assistants.list();
    return assistants;
  },
});

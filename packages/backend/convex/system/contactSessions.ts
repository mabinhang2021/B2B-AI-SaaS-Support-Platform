import { ConvexError, v } from 'convex/values';
import { internalMutation, internalQuery } from '../_generated/server';

const SESSION_DURATION_MS = 24*60*60*1000; //24hours
const AUTO_REFRESH_THRESHOLD_MS = 4 * 60 * 60 * 1000; // 4 HOURS

export const getOne = internalQuery({
  args: {
    contactSessionId: v.id('contactSessions'),
  },
  handler: async (ctx, args) => {
    return ctx.db.get(args.contactSessionId);
  },
});

export const refresh = internalMutation({
  args: {
    contactSessionId: v.id('contactSessions'),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    if (!contactSession) {
      throw new ConvexError('Contact session not found');
    }
    if (contactSession.expiresAt < Date.now()) {
      throw new ConvexError('Contact session expired');
    }
    const timeRemaining = contactSession.expiresAt - Date.now();
    if (timeRemaining < AUTO_REFRESH_THRESHOLD_MS) {
      const newExpiresAt = Date.now() + SESSION_DURATION_MS;
      await ctx.db.patch(args.contactSessionId, {
        expiresAt: newExpiresAt,
      });
      return { ...contactSession, expiresAt: newExpiresAt };
    }
    return contactSession;
  },
});

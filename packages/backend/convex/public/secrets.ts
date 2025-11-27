import {v} from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";

export const getVapiSecrets = action({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const plugin = await ctx.runQuery(
            internal.system.plugins.getByOrganizationIdAndService,
            {
                organizationId: args.organizationId,
                service: 'vapi',
            }
        )
        if (!plugin || !plugin.secrets) {
            return null;
        }
        
        // 类型断言并验证数据
        const secretData = plugin.secrets as {
            privateApiKey: string;
            publicApiKey: string;
        };
        
        // 只返回publicApiKey，确保安全
        if (!secretData.publicApiKey) {
            return null;
        }
        
        return {
            publicApiKey: secretData.publicApiKey
        };
    }
})
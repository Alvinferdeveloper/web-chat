import supabase from "@/lib/supabase";
import { ApiError } from "../lib/api-helpers";

export class UsageService {
    static async isFreePlanLimitReached(subscriptionId: string, planId: number) {
        const { data: usage, error: usageError } = await supabase.from('usage_log').select('tokens_used').eq('suscription_id', subscriptionId).single();
        if (usageError) {
            throw new ApiError(500, `Error fetching usage data: ${usageError.message}`);
        }

        const { data: plan, error: planError } = await supabase.from('plan').select('name, tokens').eq('id', planId).single();
        if (planError) {
            throw new ApiError(500, `Error fetching plan data: ${planError.message}`);
        }

        if (plan?.name == 'FREE' && usage?.tokens_used >= plan?.tokens) {
            return true;
        }
        return false;
    }

    static async addInitialUsage(subscriptionId: string, userId: string) {
        const { data, error } = await supabase.from('usage_log').insert({
            suscription_id: subscriptionId,
            user_id: userId
        });

        if (error) {
            throw new ApiError(500, `Error adding initial usage: ${error.message}`);
        }
    }

    static async updateUsage(subscriptionId: string, tokensUsed: number) {
        const { data: currentData, error: selectError } = await supabase
            .from('usage_log')
            .select('tokens_used, request_count')
            .eq('suscription_id', subscriptionId)
            .single();

        if (selectError) {
            throw new ApiError(500, `Error fetching current usage: ${selectError.message}`);
        } else {
            const newTokensUsed = currentData.tokens_used + tokensUsed;
            const newRequestCount = currentData.request_count + 1;
            const { data, error } = await supabase
                .from('usage_log')
                .update({ tokens_used: newTokensUsed, request_count: newRequestCount })
                .eq('suscription_id', subscriptionId);

            if (error) {
                throw new ApiError(500, `Error updating usage: ${error.message}`);
            }
        }
    }
}
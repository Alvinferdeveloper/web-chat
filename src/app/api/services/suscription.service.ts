import supabase from "@/lib/supabase";
import { ApiError } from "../lib/api-helpers";

export class SuscriptionService {
    static async assignFreeSuscription(userId: string): Promise<string> {
            const { data: freePlan, error: freePlanError } = await supabase
                .from('plan')
                .select('id, tokens')
                .eq('name', 'FREE')
                .single();

            if (freePlanError) {
                throw new ApiError(500, `Error fetching free plan data: ${freePlanError.message}`);
            }

            if (!freePlan) {
                throw new ApiError(500, "Free plan not found in database.");
            }

            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 31);

            const { data: suscription, error } = await supabase
                .from('suscription')
                .insert({
                    user_id: userId,
                    plan_id: freePlan.id,
                    start_date: startDate,
                    end_date: endDate,
                    status: 'ACTIVE'
                }).select("id").single();
            if(error){
                throw new ApiError(500, `Error assigning free subscription: ${error.message}`);
            }
            return suscription?.id;
    }
    static async suscriptionExists(planId: number, userId: string) {
        const { count, error } = await supabase
        .from("suscription")
        .select("id", { count: "exact", head: true })
        .eq("plan_id", planId)
        .eq("user_id", userId)
        .eq("status", "ACTIVE");
      
      if (error) {
        throw new ApiError(500, `Error checking for existing subscription: ${error.message}`);
      }
      const exists = (count ?? 0) > 0;
      return exists;
    }

    static async addSuscription(planId: number, userId: string) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 31);
        const { data, error } = await supabase
            .from("suscription")
            .insert({
                user_id: userId,
                plan_id: planId,
                start_date: startDate,
                end_date: endDate,
                status: 'ACTIVE'
            }).select("id").single();
        if(error){
            throw new ApiError(500, `Error adding subscription: ${error.message}`);
        }
        return data.id;
    }
}

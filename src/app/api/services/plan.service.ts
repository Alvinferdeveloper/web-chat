import supabase from '@/lib/supabase';

export class PlanService {
    static async assignFreePlan(userId: string) {
        try {
            const { data: freePlan } = await supabase
                .from('plan')
                .select('id, tokens')
                .eq('name', 'FREE')
                .single();

            if (!freePlan) {
                return false;
            }

            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 31);

            const { error } = await supabase
                .from('suscription')
                .insert({
                    user_id: userId,
                    plan_id: freePlan.id,
                    start_date: startDate,
                    end_date: endDate,
                    status: 'ACTIVE'
                });
            return !error;
        } catch (error) {
            return false;
        }
    }
    static async getUserPlan(planId: number | null, userId: string | undefined) {
        let plan;
        if (!planId) {
            plan = await supabase
                .from("plan")
                .select('id')
                .eq("name", 'FREE')
                .single();
        }
        else {
            plan = await supabase
                .from("plan")
                .select('id')
                .eq("id", planId)
                .single();
        }
        const { data, error } = await supabase
            .from("suscription")
            .select("plan_id")
            .eq('plan_id', plan.data?.id)
            .eq('user_id', userId)
            .eq("status", "ACTIVE")
            .single();
        return error ? null : data?.plan_id;
    }

    static async getPlanById(planId: number) {
        const { data, error } = await supabase.from('plan').select('id, name, price, interval').eq('id', planId).single();
        return error ? null : data;
    }
}
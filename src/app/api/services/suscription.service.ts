import supabase from "@/lib/supabase";
export class SuscriptionService {
    static async assignFreeSuscription(userId: string) {
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
    static async suscriptionExists(planId: number, userId: string) {
        const { count, error } = await supabase
        .from("suscription")
        .select("id", { count: "exact", head: true })
        .eq("plan_id", planId)
        .eq("user_id", userId)
        .eq("status", "ACTIVE");
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
            throw new Error(error.message);
        }
        return data.id;
    }


}

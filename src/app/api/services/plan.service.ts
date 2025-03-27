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
}
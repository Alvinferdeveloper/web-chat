import supabase from '@/lib/supabase';

export class PlanService {
    static async getPlanById(planId: number) {
        const { data, error } = await supabase.from('plan').select('id, name, price, interval').eq('id', planId).single();
        return error ? null : data;
    }
}
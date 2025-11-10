import supabase from '@/lib/supabase';
import { ApiError } from '../lib/api-helpers';

export class PlanService {
    static async getPlanById(planId: number) {
        const { data, error } = await supabase.from('plan').select('id, name, price, interval').eq('id', planId).single();
        
        if (error) {
            // PGRST116 is the code for "no rows found"
            if (error.code === 'PGRST116') {
                throw new ApiError(404, `Plan with ID ${planId} not found.`);
            }
            throw new ApiError(500, `Error fetching plan: ${error.message}`);
        }
        return data;
    }
}
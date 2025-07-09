'use server'
import supabase from "@/lib/supabase";
import { unstable_cache } from 'next/cache';

export const getPlans = unstable_cache(
    async () => {
        const { data, error } = await supabase.from('plan').select('*');
        if (error) {
            return null;
        }
        return data;
    },
    ['plans'],
    {
        tags: ['plans'],
    }
)

export async function getMostPopularPlanId() {
    const { data, error } = await supabase.rpc('get_most_popular_plan')
    if (error) {
        return null;
    }
    return data.length > 0 ? data[0].plan_id : null;
}
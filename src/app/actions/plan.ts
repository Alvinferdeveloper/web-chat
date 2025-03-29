'use server'
import supabase from "@/lib/supabase";

export async function getPlans() {
    return supabase.from('plan').select('*');
}

export async function getMostPopularPlanId() {
    const { data, error } = await supabase.rpc('get_most_popular_plan')
    if (error) {
        return null;
    }
    return data.length > 0 ? data[0].plan_id : null;
}
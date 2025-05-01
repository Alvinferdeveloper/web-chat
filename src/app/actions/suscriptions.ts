import supabase from "@/lib/supabase";
export async function getUserSuscriptions(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('suscription')
        .select('plan_id')
        .eq('user_id', userId)
        .eq('status', 'ACTIVE');

    if (error || !data) {
        return [];
    }

    return data.map(plan => plan.plan_id);
}

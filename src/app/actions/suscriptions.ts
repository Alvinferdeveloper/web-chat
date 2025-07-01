"use server"
import supabase from "@/lib/supabase";
import { Suscription } from "@/app/types/types";

export async function getUserSuscriptions(userId: string): Promise<Suscription[]> {
    const { data, error } = await supabase
        .from('suscription')
        .select('plan_id, id')
        .eq('user_id', userId)
        .eq('status', 'ACTIVE');
    if (error || !data) {
        return [];
    }
    return data.map(subscription => ({ planId: subscription.plan_id, id: subscription.id }));
}

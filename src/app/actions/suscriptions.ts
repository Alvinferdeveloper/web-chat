"use server"
import supabase from "@/lib/supabase";
import { Suscription } from "@/app/types/types";
import { unstable_cache } from "next/cache";

export const getUserSuscriptions = unstable_cache(
    async (userId: string): Promise<Suscription[] | null> => {
        const { data, error } = await supabase
            .from('suscription')
            .select('plan_id, id')
            .eq('user_id', userId)
            .eq('status', 'ACTIVE');

        if (error || !data) {
            return null;
        }
        
        return data.map(subscription => ({ planId: subscription.plan_id, id: subscription.id }));
    },
    ['user_suscriptions'],
    {
        tags: ['plans'],
    }
)


import { useState, useEffect } from 'react';
import { useGlobalContext } from '@/app/providers/globalContextProvider';
import { getPlans } from '@/app/actions/plan';
import { getUserSuscriptions } from '@/app/actions/suscriptions';
import { useSession } from 'next-auth/react';
import { Suscription } from '@/app/types/types';

interface Plan {
    id: number,
    name: string;
    subtitle: string;
}

export function usePlans() {
    const { setActiveSubscription } = useGlobalContext();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [userSuscriptions, setUserSuscriptions] = useState<Suscription[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchPlans = async () => {
            const plans = await getPlans();
            if (plans.data) {
                setPlans(plans.data);
            }
        }
        fetchPlans();
    }, []);

    useEffect(() => {
        const fetchUserActiveSuscriptions = async () => {
            if (session?.user.id) {
                const userActiveSuscriptions = await getUserSuscriptions(session.user.id);
                setUserSuscriptions(userActiveSuscriptions);
            }
        }
        fetchUserActiveSuscriptions();
    }, [session]);

    useEffect(() => {
        if (userSuscriptions.length > 0) {
            setActiveSubscription({ planId: userSuscriptions[userSuscriptions.length - 1].planId, id: userSuscriptions[userSuscriptions.length - 1].id });
        }
    }, [userSuscriptions, setActiveSubscription]);

    const handleActivePlan = (planId: number) => {
        const subscription = userSuscriptions.find(suscription => suscription.planId === planId);
        if (subscription) {
            setActiveSubscription({ planId, id: subscription.id });
        }
    };

    return { plans, userSuscriptions, handleActivePlan };
}

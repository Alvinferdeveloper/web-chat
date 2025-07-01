"use client"
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useGlobalContext } from "@/app/providers/globalContextProvider";
import { getPlans } from "@/app/actions/plan";
import { useState } from "react";
import { getUserSuscriptions } from "@/app/actions/suscriptions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import getPlanIcon from "@/app/components/utils/getPlanIcon";
import { Suscription } from "@/app/types/types";

interface Plan {
    id: number,
    name: string;
    subtitle: string;
}

export default function PlansDropDownMenu() {
    const { activeSubscription, setActiveSubscription } = useGlobalContext();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [userSuscriptions, setUserSuscriptions] = useState<Suscription[]>([]);
    const { data: session } = useSession();
    const router = useRouter();
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
            const userActiveSuscriptions = await getUserSuscriptions(session?.user.id!);
            setUserSuscriptions(userActiveSuscriptions);
        }
        fetchUserActiveSuscriptions();
    }, [session]);

    useEffect(() => {
        if (userSuscriptions.length > 0) {
            setActiveSubscription({ planId: userSuscriptions[userSuscriptions.length - 1].planId, id: userSuscriptions[userSuscriptions.length - 1].id });
        }
    }, [userSuscriptions]);

    const handleActivePlan = (planId: number) => {
        userSuscriptions.find(suscription => suscription.planId == planId) ? setActiveSubscription({ planId, id: userSuscriptions[userSuscriptions.length - 1].id }) : null;
    }
    return (
        <DropdownMenuContent align="start" className="w-[280px] rounded-xl  bg-gray-900 text-gray-100 border-gray-800 p-0">
            <div className="flex flex-col space-y-1 p-1">
                {plans.map((plan) => {
                    const upgradable = userSuscriptions.every(suscription => suscription.planId != plan.id)
                    return (
                        <DropdownMenuItem
                            key={plan.id}
                            className={cn(
                                "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2  data-[highlighted]:hover:bg-gray-800 data-[highlighted]:hover:text-white",
                            )}
                            onClick={() => handleActivePlan(Number(plan.id))}
                        >
                            <div className="flex items-center gap-3">
                                {getPlanIcon(plan.name)}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-white">{plan.name}</span>
                                    <span className="text-xs text-zinc-400">{plan.subtitle}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {upgradable && (
                                    <Button size="sm" variant="secondary" className="mr-2 h-7 rounded-md px-2 text-xs"
                                        onClick={() => router.push('/plans')}>
                                        Upgrade
                                    </Button>
                                )}
                                {plan.id == activeSubscription.planId && <Check className="h-5 w-5 text-green-500" />}
                            </div>
                        </DropdownMenuItem>
                    )
                })}
            </div>
        </DropdownMenuContent>
    )
}
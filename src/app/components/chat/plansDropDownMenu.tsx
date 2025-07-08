"use client"
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useGlobalContext } from "@/app/providers/globalContextProvider";
import { useRouter } from "next/navigation";
import getPlanIcon from "@/app/components/utils/getPlanIcon";
import { usePlans } from "@/app/hooks/usePlans";

export default function PlansDropDownMenu() {
    const { activeSubscription } = useGlobalContext();
    const { plans, userSuscriptions, handleActivePlan } = usePlans();
    const router = useRouter();

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
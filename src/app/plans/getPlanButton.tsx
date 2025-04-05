"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Props {
    mostPopularPlanId: number,
    planId: number,
    userPlanId?: number,
    planName: string
}

export default function GetPlanButton({ mostPopularPlanId, planId, userPlanId, planName }: Props) {
    const handleClick = () => {
        fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ planId })
        }).then(res => res.json())
            .then(data => window.location.href = data.stripeUrl)
    }

    const isPopular = mostPopularPlanId === planId
    const isCurrentPlan = planId === userPlanId

    return (
        <Button
            className={cn(
                "w-full transition-all duration-200",
                isPopular ? [
                    "bg-blue-600 hover:bg-blue-700",
                    "border-blue-600 hover:border-blue-700",
                    "text-white"
                ] : [
                    "bg-transparent hover:bg-gray-800",
                    "border-[#2a2f45] border-2 hover:border-gray-700",
                    "text-gray-200"
                ],
                isCurrentPlan && "opacity-50 cursor-not-allowed"
            )}
            disabled={isCurrentPlan}
            onClick={handleClick}
        >
            {isCurrentPlan ? "Your current plan" : `Get ${planName}`}
        </Button>
    )
}

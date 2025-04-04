import { Button } from "@/components/ui/button"

interface Props {
    mostPopularPlanId: number,
    planId: number,
    userPlanId?: number,
    planName: string
}
export default function GetPlanButton({ mostPopularPlanId, planId, userPlanId, planName }: Props) {
    return (
        <Button
            className="w-full bg-transparent text-white hover:opacity-70"
            variant={mostPopularPlanId === planId ? "default" : "outline"}
            style={{
                backgroundColor: mostPopularPlanId === planId ? "#3b82f6" : "transparent",
                borderColor: mostPopularPlanId === planId ? "#3b82f6" : "#2a2f45",
                color: mostPopularPlanId === planId ? "white" : "#e2e8f0",
            }}
            disabled={planId === userPlanId}
        >
            {planId === userPlanId ? "Your current plan" : `Get ${planName}`}
        </Button>
    )
}

import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getMostPopularPlanId, getPlans } from "../actions/plan";
import { Badge } from '@/components/ui/badge';
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import GetPlanButton from "./getPlanButton";
import { cn } from "@/lib/utils";

interface Plan {
    id: string,
    name: string;
    price: number;
    features: string[];
    description: string;
    interval: string;
}

export default async function PricingCards() {
    const { data: plans } = await getPlans();
    const mostPopularPlanId = await getMostPopularPlanId();
    const session = await getServerSession(authOptions);

    return (
        <div className="flex justify-center h-[70%]">
            <div className="grid md:grid-cols-3 gap-6">
                {plans?.map((plan: Plan) => {
                    const isPopular = plan.id === mostPopularPlanId;
                    const isCurrentPlan = plan.id === session?.user.plan;

                    return (
                        <Card
                            key={plan.name}
                            className={cn(
                                "flex flex-col bg-darkBlue border-[#2a2f45]",
                                "transition-all duration-200",
                                isPopular && "border-blue-500 shadow-lg shadow-blue-500/10"
                            )}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-white">{plan.name}</CardTitle>
                                        <CardDescription className="mt-1 text-gray-400">{plan.description}</CardDescription>
                                    </div>
                                    {isPopular && (
                                        <Badge className={cn(
                                            "bg-blue-500 text-white",
                                            "hover:bg-blue-600",
                                            "transition-colors duration-200"
                                        )}>
                                            Popular
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="font-bold text-3xl text-white">
                                    ${plan.price}
                                    <span className="text-sm font-normal text-gray-400">/{plan.interval}</span>
                                </div>

                                <ul className="mt-6 space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-blue-500" />
                                            <span className="text-sm text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <div className={cn(
                                    "w-full",
                                    isCurrentPlan && "cursor-not-allowed"
                                )}>
                                    <GetPlanButton
                                        mostPopularPlanId={Number(mostPopularPlanId)}
                                        planId={Number(plan.id)}
                                        userPlanId={session?.user.plan ? Number(session?.user.plan) : undefined}
                                        planName={plan.name}
                                    />
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getMostPopularPlanId, getPlans } from "../actions/plan";
import { Badge } from '@/components/ui/badge'
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

interface Plan {
    id: string,
    name: string;
    price: number;
    features: string[];
    description: string;
}

export default async function PricingCards() {
    const { data: plans } = await getPlans();
    const mostPopularPlanId = await getMostPopularPlanId();
    const session = await getServerSession(authOptions);
    return (
        <div className="flex justify-center h-[70%]">
            <div className="grid md:grid-cols-3 gap-6">
                {plans?.map((plan: Plan) => (
                    <Card
                        key={plan.name}
                        className={`flex flex-col bg-[#111530] border-[#2a2f45] ${plan.id === mostPopularPlanId ? "border-blue-500 shadow-lg shadow-blue-500/10" : ""}`}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-white">{plan.name}</CardTitle>
                                    <CardDescription className="mt-1 text-gray-400">{plan.description}</CardDescription>
                                </div>
                                {plan.id === mostPopularPlanId && <Badge className="bg-blue-500 text-white hover:bg-blue-600">Popular</Badge>}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="font-bold text-3xl text-white">
                                ${plan.price}
                                <span className="text-sm font-normal text-gray-400">/mes</span>
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
                            <div className={` w-full ${plan.id === session?.user.plan && "cursor-not-allowed"}`}>
                                <Button
                                    className="w-full bg-transparent text-white hover:opacity-70"
                                    variant={mostPopularPlanId === plan.id ? "default" : "outline"}
                                    style={{
                                        backgroundColor: mostPopularPlanId === plan.id ? "#3b82f6" : "transparent",
                                        borderColor: mostPopularPlanId === plan.id ? "#3b82f6" : "#2a2f45",
                                        color: mostPopularPlanId === plan.id ? "white" : "#e2e8f0",
                                    }}
                                    disabled={plan.id === session?.user.plan}
                                >
                                    {plan.id === session?.user.plan ? "Your current plan" : `Get ${plan.name}`}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
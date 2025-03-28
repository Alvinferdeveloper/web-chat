import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/lib/supabase";

interface Plan {
    name: string;
    price: number;
    features: string[];
    description: string;
}

export default async function PricingCards() {
    const { data: plans } = await supabase.from('plan').select('*');
    return (
        <div className="flex justify-center h-[70%]">
            <div className="grid md:grid-cols-3 gap-6">
                {plans?.map((plan: Plan) => (
                    <Card
                        key={plan.name}
                        className={`flex flex-col bg-[#111530] border-[#2a2f45]`}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-white">{plan.name}</CardTitle>
                                    <CardDescription className="mt-1 text-gray-400">{plan.description}</CardDescription>
                                </div>
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
                            <Button
                                className="w-full"
                                variant={"outline"}
                            >
                                {`Get ${plan.name}`}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
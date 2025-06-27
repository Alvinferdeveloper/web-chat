"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useSession } from "next-auth/react"

interface Props {
    planId: number,
    isPopular: boolean,
    isCurrentPlan: boolean,
    planName: string
}

export default function GetPlanButton({ planId, isPopular, isCurrentPlan, planName }: Props) {
    const [paypalClientId, setPaypalClientId] = useState<string>("");
    const [showPaypalButton, setShowPaypalButton] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { data: session } = useSession();

    const handleClick = async () => {
        if (isCurrentPlan) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ planId })
            });

            const data = await response.json();
            if (data.paypalClientId) {
                setPaypalClientId(data.paypalClientId);
                setShowPaypalButton(true);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createOrder = async (data: any, actions: any) => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ planId })
            });

            const orderData = await response.json();
            return orderData.paypalOrderId;
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Failed to create order');
        }
    };

    const onApprove = async (data: any) => {
        try {
            // Capturar el pago
            const response = await fetch('/api/paypal/capture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderID: data.orderID,
                    planId: planId,
                    userId: session?.user.id!
                })
            });

            const result = await response.json();

            if (result.success) {
                // Recargar la página para actualizar el estado de la suscripción
                window.location.reload();
            }
        } catch (error) {
            console.error('Error capturing payment:', error);
        }
    };

    const onError = (err: any) => {
        console.error('PayPal error:', err);
        // Aquí podrías mostrar un mensaje de error al usuario
    };

    if (isCurrentPlan || isLoading) {
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
                    "opacity-50 cursor-not-allowed"
                )}
                disabled={true}
            >
                {isCurrentPlan ? "Your current plan" : "Processing..."}
            </Button>
        );
    }


    return (
        <div className={cn(
            "w-full transition-all duration-200",
            isPopular ? [
                "border-blue-500 shadow-lg shadow-blue-500/10",
                "rounded-lg overflow-hidden"
            ] : ""
        )}>
            <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
                <PayPalButtons
                    style={{
                        layout: "vertical",
                        color: isPopular ? "blue" : "silver",
                        height: 45,
                        tagline: false,
                        shape: "rect",
                    }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    disabled={isLoading}
                />
            </PayPalScriptProvider>
        </div>
    );

}

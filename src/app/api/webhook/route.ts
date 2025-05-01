import Stripe from "stripe";
import { NextRequest, NextResponse } from 'next/server';
import { headers } from "next/headers";
import { PaymentService } from "../services/payment.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = await headers()
    const sig = headersList.get('stripe-signature') || '';
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const { planId, userId } = session.metadata as { planId: string, userId: string };
            try {
                await PaymentService.addPayment({
                    plan_id: Number(planId),
                    user_id: userId,
                    amount: Number(session.amount_total),
                    payment_method: 'STRIPE',
                    status: 'COMPLETED'
                });
            } catch (error) {
                const err = error as Error;
                return NextResponse.json({ error: err.message }, { status: 400 })
            }
            break;
        default:
            break;
    }
    return new Response(null, { status: 200 })
}

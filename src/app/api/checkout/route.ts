import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PlanService } from '../services/plan.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(req: NextRequest) {
    const { planId } = await req.json();
    const plan = await PlanService.getPlanById(planId);
    if(!plan){
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    const session = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/plans`,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Web chat ${plan.name} subscription`,
                        description: `${plan.interval == 'month' ? 'Monthly' : 'Yearly'} subscription\nSubtotal: $20.00\nTotal due today: $20.00`,

                    },
                    recurring: {
                        interval: plan.interval,
                        interval_count: 1,
                    },
                    unit_amount: plan.price * 100, // in cents
                },
                quantity: 1,
            },

        ],
        mode: 'subscription',
    });
   
    return NextResponse.json({ stripeUrl: session.url });
}
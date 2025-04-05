import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST() {
    const session = await stripe.checkout.sessions.create({
        success_url: 'http://localhost:3000/plans',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Web chat Plus subscription',
                        description: 'Monthly subscription\nSubtotal: $20.00\nTotal due today: $20.00',

                    },
                    recurring: {
                        interval: 'month',
                        interval_count: 1,
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },

        ],
        mode: 'subscription',
    });
   
    return NextResponse.json({ stripeUrl: session.url });
}
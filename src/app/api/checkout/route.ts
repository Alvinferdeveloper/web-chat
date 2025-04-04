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
                        name: 'T-shirt',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
    });

    return NextResponse.json({ stripeUrl: session.url });
}
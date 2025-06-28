import { NextRequest, NextResponse } from 'next/server';
import { PlanService } from '../services/plan.service';
import { SuscriptionService } from '../services/suscription.service';
import { PayPalService } from '../services/paypal.service';
import { requireAuth } from '../lib/auth-helper';

export async function POST(req: NextRequest) {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;
    
    const { planId } = await req.json();
    const userId = auth.userId;

    const plan = await PlanService.getPlanById(planId);
    if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const subscriptionExists = await SuscriptionService.suscriptionExists(planId, userId);
    if (subscriptionExists) {
        return NextResponse.json({ error: "Subscription already exists" }, { status: 400 });
    }

    try {
        // Crear la orden de PayPal
        const order = await PayPalService.createOrder(
            plan.price,
            plan.id,
            userId
        );

        return NextResponse.json({
            paypalOrderId: order.id,
            paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create PayPal order' },
            { status: 500 }
        );
    }
}
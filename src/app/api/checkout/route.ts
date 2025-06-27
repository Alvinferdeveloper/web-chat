import { NextRequest, NextResponse } from 'next/server';
import { PlanService } from '../services/plan.service';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { SuscriptionService } from '../services/suscription.service';
import { PayPalService } from '../services/paypal.service';

export async function POST(req: NextRequest) {
    const { planId } = await req.json();
    const userSession = await getServerSession(authOptions);

    if (!userSession?.user.id) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const plan = await PlanService.getPlanById(planId);
    if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const subscriptionExists = await SuscriptionService.suscriptionExists(planId, userSession.user.id);
    if (subscriptionExists) {
        return NextResponse.json({ error: "Subscription already exists" }, { status: 400 });
    }

    try {
        // Crear la orden de PayPal
        const order = await PayPalService.createOrder(
            plan.price,
            plan.id,
            userSession.user.id
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
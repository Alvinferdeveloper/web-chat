import { NextRequest } from 'next/server';
import { PlanService } from '../services/plan.service';
import { SuscriptionService } from '../services/suscription.service';
import { PayPalService } from '../services/paypal.service';
import { requireAuth } from '../lib/auth-helper';
import { withErrorHandler, ApiError, ApiResponse } from '../lib/api-helpers';

export const POST = withErrorHandler(async (req: Request) => {
    const { userId } = await requireAuth(req);

    const { planId } = await req.json();

    const plan = await PlanService.getPlanById(planId);

    const subscriptionExists = await SuscriptionService.suscriptionExists(plan.id, userId);
    if (subscriptionExists) {
        throw new ApiError(400, "Subscription already exists for this plan.");
    }

    const order = await PayPalService.createOrder(
        plan.price,
        plan.id.toString(),
        userId
    );

    return ApiResponse.success({
        paypalOrderId: order.id,
        paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    });
});
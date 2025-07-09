import { NextRequest, NextResponse } from 'next/server';
import { PayPalService } from '../../services/paypal.service';
import { PaymentService } from '../../services/payment.service';
import { SuscriptionService } from '../../services/suscription.service';
import { UsageService } from '../../services/usage.service';
import { requireAuth } from '../../lib/auth-helper';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;
    
    const { orderID, planId } = await req.json();
    const userId = auth.userId;
    
    if (!orderID || !planId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Capturar el pago en PayPal
    const captureData = await PayPalService.captureOrder(orderID);
    
    // Verificar que el pago se haya completado exitosamente
    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Registrar el pago en la base de datos
    await PaymentService.addPayment({
      plan_id: Number(planId),
      user_id: userId,
      amount: Number(captureData.purchase_units?.[0]?.payments?.captures?.[0]?.value || 0),
      payment_method: 'PAYPAL',
      status: 'COMPLETED',
      transaction_id: captureData.id
    });

    // Crear la suscripción
    const subscriptionId = await SuscriptionService.addSuscription(Number(planId), userId);
    
    // Agregar uso inicial
    await UsageService.addInitialUsage(subscriptionId, userId);

    revalidateTag('plans');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal order' },
      { status: 500 }
    );
  }
}

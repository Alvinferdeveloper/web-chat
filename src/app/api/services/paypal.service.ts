// Usar require para importar el SDK de PayPal
import * as paypal from '@paypal/checkout-server-sdk';

// Configuración del entorno de PayPal
const configureEnvironment = () => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_SECRET_KEY!;

  const environment = process.env.NODE_ENV === 'production'
    //@ts-ignore
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    //@ts-ignore
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
  //@ts-ignore
  return new paypal.core.PayPalHttpClient(environment);
};

const client = configureEnvironment();

export const PayPalService = {
  createOrder: async (amount: number, planId: string, userId: string) => {
    const request = new paypal.orders.OrdersCreateRequest();

    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString(),
        },
        description: `Suscripción al plan ${planId}`,
        custom_id: `${userId}_${planId}_${Date.now()}`,
      }],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/plans?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/plans?canceled=true`,
        brand_name: 'Web Chat',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    });

    const response = await client.execute(request);
    return response.result;
  },

  captureOrder: async (orderId: string) => {
    // @ts-ignore - Ignorar errores de tipo para el constructor
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    // @ts-ignore - PayPal types are incorrect, empty object is valid here
    request.requestBody({});

    const response = await client.execute(request);
    return response.result;
  },

  getOrderDetails: async (orderId: string) => {
    // @ts-ignore - Ignorar errores de tipo para el constructor
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const response = await client.execute(request);
    return response.result;
  }
};

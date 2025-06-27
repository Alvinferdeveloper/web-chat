import supabase from "@/lib/supabase";
import { randomUUID } from "crypto";

type PaymentMethod = 'STRIPE' | 'PAYPAL';
type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

interface Payment {
    plan_id: number;
    user_id: string;
    amount: number;
    payment_method: PaymentMethod;
    status: PaymentStatus;
    transaction_id?: string;
}
export class PaymentService {
    static async addPayment(payment: Payment) {
        const { data, error } = await supabase.from('payment').insert([
            {
                ...payment,
                id: randomUUID(),
            }
        ]);
        if (error) {
            throw new Error(error.message);
        }
    }
}
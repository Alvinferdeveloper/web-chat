import { randomUUID } from 'crypto'
import supabase from '@/lib/supabase';
import { SuscriptionService } from './suscription.service';
import { UsageService } from './usage.service';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
}

interface AuthAccount {
  provider: string;
  provider_id: string;
}

interface UserId {
  id: string;
}

export class AuthService {
  static async findUser(providerId: string, provider: string) {
    const { data: existingUser } = await supabase
      .from('user')
      .select()
      .eq('provider_id', providerId)
      .eq('provider', provider.toUpperCase())
      .single();

    return existingUser;
  }

  static async createUser(user: AuthUser, account: AuthAccount) {
    const { data } = await supabase.from('user').insert([
      {
        ...user,
        id: randomUUID(),
        provider: account.provider.toUpperCase(),
        provider_id: account.provider_id
      }
    ]).select<'id', UserId>('id').single();

    return data?.id || null;
  }

  static async handleSignIn(user: AuthUser, account: AuthAccount) {
    try {
      const existingUser = await this.findUser(account.provider_id, account.provider);

      if (!existingUser) {
        const newUserId = await this.createUser(user, account);
        if(newUserId){
            const subscriptionId = await SuscriptionService.assignFreeSuscription(newUserId);
            await UsageService.addInitialUsage(subscriptionId, newUserId);
        }
        return newUserId;
      }
      return existingUser.id;
    } catch (error) {
      return null;
    }
  }
} 
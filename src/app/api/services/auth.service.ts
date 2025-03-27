import { randomUUID } from 'crypto'
import supabase from '@/lib/supabase';

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
    const { error } = await supabase.from('user').insert([
      {
        ...user,
        id: randomUUID(),
        provider: account.provider.toUpperCase(),
        provider_id: account.provider_id
      }
    ]);

    return !error;
  }

  static async handleSignIn(user: AuthUser, account: AuthAccount) {
    try {
      const existingUser = await this.findUser(account.provider_id, account.provider);

      if (!existingUser) {
        return await this.createUser(user, account);
      }

      return true;
    } catch (error) {
      return false;
    }
  }
} 
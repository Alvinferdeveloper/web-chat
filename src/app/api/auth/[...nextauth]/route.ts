import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from 'next-auth/providers/github';
import supabase from "@/lib/supabase";
import { randomUUID } from "node:crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        const { data: existingUser } = await supabase
          .from('user')
          .select()
          .eq('provider_id', user.id)
          .eq('provider', account.provider.toUpperCase())
          .single();

        if (!existingUser) {
          const { error } = await supabase.from('user').insert([
            {
              ...user,
              id: randomUUID(),
              provider: account.provider.toUpperCase(),
              provider_id: user.id
            }
          ]);
          return !error;
        }

        return true;
      }
      return false;
    }
  }
}
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 
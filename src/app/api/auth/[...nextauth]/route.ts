import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from 'next-auth/providers/github';
import { AuthService } from "../../services/auth.service";
import { PlanService } from "../../services/plan.service";

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
        const newUserId = await AuthService.handleSignIn(
          {
            id: user.id!,
            email: user.email!,
            name: user.name!,
            image: user.image!
          },
          {
            provider: account.provider,
            provider_id: user.id!
          }
        );
        if (newUserId) {
          user.id = newUserId;
          return true;
        }
        return false;
      }

      return false;
    },
    async session({ session,token }) {
      session.user.id = token.sub;
      const userPlan = await PlanService.getUserPlan(null, token.sub);
      session.user.plan = userPlan;
      return session;
    }
  }
}
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 
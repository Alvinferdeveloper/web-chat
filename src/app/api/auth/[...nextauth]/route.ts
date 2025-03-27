import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from 'next-auth/providers/github';
import { AuthService } from "../../services/auth.service";

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
        return await AuthService.handleSignIn(
          {
            id: user.id,
            email: user.email!,
            name: user.name!,
            image: user.image!
          },
          {
            provider: account.provider,
            provider_id: user.id
          }
        );
      }
      return false;
    }
  }
}
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 
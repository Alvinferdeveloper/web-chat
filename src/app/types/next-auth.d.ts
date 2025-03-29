import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    plan: string; 
  }

  interface Session {
    user: User; 
  }
}

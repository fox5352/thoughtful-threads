import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import Github from "next-auth/providers/github";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    Github({
      clientId: process.env.NEXT_GITHUB_ID!,
      clientSecret: process.env.NEXT_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("user", user);
      console.log("account", account);
      console.log("profile", profile);
      
      return true;
    },
    async jwt({ token, user }) {
      return token;
    },
    async session({ token, session, user }) {
      return session;
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
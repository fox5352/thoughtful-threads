import NextAuth from "next-auth/next";
import { NextAuthOptions, Session } from "next-auth";
import Github from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
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
      // console.log("user", user);
      // console.log("account", account);
      // console.log("profile", profile);
      
      return true;
    },
    async jwt({ token, user, account}) {
      if (account && user) {
        // This condition will be true only on sign in
        // Fetch user ID from your database here
        // For example:
        // const dbUser = await fetchUserFromDatabase(user.email);
        // token.userId = dbUser.id;
        
        // For demonstration, let's assume we got the ID:
        token.userId = "123456";        
      }
      return token;
    },
    async session({ token, session, user }) {
      // Add the userId to the session
      if (token.userId && session.user) {
        session.user.id = `${token.userId}`;
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
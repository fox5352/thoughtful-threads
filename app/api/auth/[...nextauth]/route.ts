import NextAuth from "next-auth/next";
import { NextAuthOptions, Session } from "next-auth";
import Github from "next-auth/providers/github";
import { createUser, getUserByEmail } from "@/model/user.model";

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
    async signIn({ user, account }) {
      
      if(user.email&& user.name){
        const userExists = await getUserByEmail(user.email);        

        if(!userExists){
          const image = user.image? user?.image : 'undefined';
          const res = await createUser(user.name, user.email, image, account?.provider || "", []);

          return res;
        }

        return true;
      }

      return false;
    },
    async jwt({ token, user, account}) {
      if (account && user.email) {
        
        // This condition will be true only on sign in
        // Fetch user ID from your database here
        // For example:
        // const dbUser = await fetchUserFromDatabase(user.email);
        // token.userId = dbUser.id;
        
        // For demonstration, let's assume we got the ID:
        token.userId = (await getUserByEmail(user.email))?.id;
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
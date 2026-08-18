import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/db";
import authConfig from "./auth.config";

// NextAuth v5
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // console.log("token", token);
      // console.log("user", user);
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      // console.log("session", session);
      // console.log("token", token);
      if (token?.id) (session.user as any).id = token.id as string;
      return session;
    },
  },
});
// console.log("USING CLIENT ID:", process.env.GOOGLE_CLIENT_ID?.slice(0, 10));

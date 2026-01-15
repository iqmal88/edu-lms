import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        return prisma.user.findUnique({
          where: { email: credentials.email },
        });
      },
    }),
  ],
callbacks: {
  jwt({ token, user }) {
    if (user) {
      const u = user as { id: string; role: string };
      token.id = u.id;
      token.role = u.role;
    }
    return token;
  },
  session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
    }
    return session;
  },
},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

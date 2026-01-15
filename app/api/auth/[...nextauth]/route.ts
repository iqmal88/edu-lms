import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

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
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }
    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;

      if (token.role === "EDUCATOR" || token.role === "LEARNER") {
        session.user.role = token.role;
      }
    }
    return session;
  },
},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

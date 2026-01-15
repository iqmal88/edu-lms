import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "EDUCATOR" | "LEARNER";
      email?: string | null;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    role: "EDUCATOR" | "LEARNER";
  }
}

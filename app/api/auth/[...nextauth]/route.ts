import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { compare } from "bcrypt";
const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const values = { email: credentials.email };
        const findUser = await prisma.user.findFirst({
          where: values,
        });
        if (!findUser) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, findUser.password);
        if (!isPasswordValid) {
          return null;
        }
        if (!findUser.verified) {
          return null;
        }
        return {
          id: String(findUser.id),
          email: findUser.email,
          name: findUser.fullName,
          role: findUser.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      const user = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
      });
      if (user) {
        token.id = String(user.id);
        token.role = user.role;
        token.fullName = user.fullName;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { compare, hashSync } from "bcrypt";
import { UserRole } from "@/src/generated/prisma/enums";
export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "USER" as UserRole,
          status: "ACTIVE",
          sessionVersion: 0,
        };
      },
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

        if (findUser.status === "BLOCKED") return null;

        const isPasswordValid = await compare(credentials.password, findUser.password);
        if (!isPasswordValid) {
          return null;
        }
        if (!findUser.verified) {
          return null;
        }
        await prisma.user.update({ where: { id: findUser.id }, data: { lastLoginAt: new Date() } });
        return {
          id: findUser.id,
          email: findUser.email,
          name: findUser.fullName,
          role: findUser.role,
          status: findUser.status,
          sessionVersion: findUser.sessionVersion,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "credentials") {
          return true;
        }

        if (!user.email) {
          return false;
        }

        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              {
                provider: account?.provider,
                providerId: account?.providerAccountId,
              },
              {
                email: user.email,
              },
            ],
          },
        });

        if (findUser) {
          if (findUser.status === "BLOCKED") return false;
          await prisma.user.update({
            where: {
              id: findUser.id,
            },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId,
              lastLoginAt: new Date(),
            },
          });
          return true;
        }
        await prisma.user.create({
          data: {
            email: user.email,
            fullName: user.name || "User #" + user.id,
            password: hashSync(user.id.toString(), 10),
            verified: new Date(),
            provider: account?.provider,
            providerId: account?.providerAccountId,
            lastLoginAt: new Date(),
          },
        });

        return true;
      } catch (error) {
        console.log("ERROR [SIGNIN]: ", error);
        return false;
      }
    },
    async jwt({ token }) {
      if (!token.email) return token;

      const dbUser = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
      });
      if (dbUser) {
        if (token.sessionVersion !== undefined && token.sessionVersion !== dbUser.sessionVersion) {
          token.invalidated = true;
        }
        token.id = String(dbUser.id);
        token.role = dbUser.role;
        token.fullName = dbUser.fullName;
        token.email = dbUser.email;
        token.sessionVersion = dbUser.sessionVersion;
        token.status = dbUser.status;
        token.invalidated = token.invalidated || dbUser.status === "BLOCKED";
      }
      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.invalidated = Boolean(token.invalidated);
      }
      return session;
    },
  },
};

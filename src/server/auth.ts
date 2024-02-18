import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { db } from "~/server/db";
import { getStudentAviralData, verifyPassword } from "~/server/utils/aviral";
import { jwtHelper, tokenOneDay, tokenOnWeek } from "~/server/utils/jwtHelper";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string;
    username?: string;
    userGroup?: string;
    admin?: {
      permissions: number;
    };
  }

  interface Session {
    user: {
      id?: string;
      name?: string;
      username?: string;
      userGroup?: string;
      admin?: {
        permissions: number;
      };
    };
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: any;
    accessToken: string;
    refreshToken: string;
    accessTokenExpired: number;
    refreshTokenExpired: number;
    error?: "RefreshAccessTokenError";
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      // credentials provider:  Save the access token and refresh token in the JWT on the initial login
      if (user) {
        const authUser = { ...user };

        const accessToken = await jwtHelper.createAcessToken(authUser);
        const refreshToken = await jwtHelper.createRefreshToken(authUser);
        const accessTokenExpired = Date.now() / 1000 + tokenOneDay;
        const refreshTokenExpired = Date.now() / 1000 + tokenOnWeek;

        return {
          ...token,
          accessToken,
          refreshToken,
          accessTokenExpired,
          refreshTokenExpired,
          user: authUser,
        };
      } else {
        if (token) {
          // In subsequent requests, check access token has expired, try to refresh it
          if (Date.now() / 1000 > token.accessTokenExpired) {
            const verifyToken = await jwtHelper.verifyToken(token.refreshToken);

            if (verifyToken) {
              const user = await db.user.findFirst({
                where: {
                  id: token.user.id,
                },
              });

              if (user) {
                const accessToken = await jwtHelper.createAcessToken(
                  token.user,
                );
                const accessTokenExpired = Date.now() / 1000 + tokenOneDay;

                return { ...token, accessToken, accessTokenExpired };
              }
            }

            return { ...token, error: "RefreshAccessTokenError" };
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          username: token.user.username as string,
          name: token.user.name as string,
          id: token.user.id,
          admin: token.user.admin,
          userGroup: token.user.userGroup,
        };
      }
      session.error = token.error;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "LDAP",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password)
          throw new Error("Missing Credentials");

        let authenticatedUserGroup = await verifyPassword(
          credentials.username,
          credentials.password,
        );

        if (!authenticatedUserGroup) throw new Error("Invalid Credentials");

        let user = await db.user.findFirst({
          where: {
            username: credentials.username,
          },
          select: {
            id: true,
            name: true,
            username: true,
            userGroup: true,
            admin: {
              select: {
                permissions: true,
              },
            },
          },
        });

        if (!user) {
          if (authenticatedUserGroup === "student") {
            let userData = await getStudentAviralData(
              credentials.username,
              credentials.password,
            );
            if (!userData) throw new Error("User Not Found");

            user = await db.user.create({
              data: {
                userGroup: authenticatedUserGroup,
                username: credentials.username,
                name: userData.name,
                email: credentials.username + "@iiita.ac.in",
                student: {
                  create: {
                    program: userData.program,
                    admissionYear: userData.admissionYear,
                    duration: userData.duration,
                    currentSemester: userData.currentSem,
                    completedCredits: userData.completedCredits,
                    totalCredits: userData.totalCredits,
                    cgpa: userData.cgpa,
                    email: credentials.username + "@iiita.ac.in",
                  },
                },
              },
              select: {
                id: true,
                name: true,
                username: true,
                userGroup: true,
                admin: {
                  select: {
                    permissions: true,
                  },
                },
              },
            });
          } else if (authenticatedUserGroup === "faculty") {
            let userData = await getStudentAviralData(
              credentials.username,
              credentials.password,
            );
            if (!userData) throw new Error("User Not Found");
            user = await db.user.create({
              data: {
                userGroup: authenticatedUserGroup,
                username: credentials.username,
                name: userData.name,
                email: credentials.username + "@iiita.ac.in",
                admin: {
                  create: {
                    permissions: 0,
                  }
                }
              },
              select: {
                id: true,
                name: true,
                username: true,
                userGroup: true,
                admin: {
                  select: {
                    permissions: true,
                  },
                },
              },
            });
          } else {
            throw new Error("Only students and faculties supported");
          }
        }
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          userGroup: user.userGroup,
          admin: user.admin,
        } as DefaultSession["user"];
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

export const getServerAuthSession = () => {
  return getServerSession(authOptions);
};

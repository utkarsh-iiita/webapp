import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";

import { env } from "~/env";
import { db } from "~/server/db";
import { mysqlTable } from "~/server/db/schema";
import { getAviralData, verifyPassword } from './utils/aviral';
import { userModel } from './db/schema/user';

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: DrizzleAdapter(db, mysqlTable),
  providers: [
    CredentialsProvider({
      name: "LDAP",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials);

        if(!await verifyPassword(credentials.username, credentials.password))
          throw new Error('Invalid Credentials');

        const user = await db.query.userModel.findFirst({
          where : (user, {eq}) =>{
            return eq(user.rollNumber, credentials.username)
          }
        })

        if(!user){
          let userData : any = await getAviralData(credentials.username, credentials.password);
          if(!userData)
              throw new Error('User Not Found');
          
          userData.email = `${userData.rollNumber.toLowerCase()}@iiita.ac.in`;
          await db.insert(userModel).values(userData);
        } 

        return { id: credentials.username };
      },
    }),
  ],
  // pages :  {
  //   signIn: '/auth/signin',
  // },
};

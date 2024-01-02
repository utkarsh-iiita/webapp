import { decode, encode } from "next-auth/jwt";

import { env } from "~/env";

export const tokenOneDay = 24 * 60 * 60;
export const tokenOnWeek = tokenOneDay * 7


const craeteJWT = (token: any, duration: number) => encode({ token, secret: env.NEXTAUTH_SECRET, maxAge: duration })

export const jwtHelper = {
  createAcessToken: (token: any) => craeteJWT(token, tokenOneDay),
  createRefreshToken: (token: any) => craeteJWT(token, tokenOnWeek),
  verifyToken: (token: string) => decode({ token, secret: env.NEXTAUTH_SECRET })
}
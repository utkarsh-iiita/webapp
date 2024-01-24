import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
} from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getAdmins: adminProcedure.input(z.string().optional()).query(async ({ ctx, input }) => {
    return await ctx.db.admin.findMany({
      where: {
        ...input && {
          user: {
            OR: [
              {
                name: {
                  contains: input,
                }
              },
              {
                username: {
                  contains: input,
                }
              },
            ]
          }
        }
      }, select: {
        permissions: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            userGroup: true
          }
        }
      }
    })
  })
});
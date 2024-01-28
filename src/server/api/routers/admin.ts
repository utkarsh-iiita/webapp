import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
} from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getAdmins: adminProcedure.input(z.string().optional()).query(async ({ ctx, input }) => {
    return await ctx.db.admin.findMany({
      where: {
        user: {
          AND: [{
            NOT: {
              id: ctx.session.user.id
            }
          },
          {
            ...input && {
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
              ],
            }
          }
          ]
        },
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
  }),

  createAdmin: adminProcedure.input(z.object({
    id: z.string(),
    permissions: z.number(),
  })).mutation(async ({ ctx, input }) => {
    if (ctx.session.user.id === input.id) {
      throw new Error("You can't make yourself admin.")
    }
    return await ctx.db.admin.create({
      data: {
        permissions: input.permissions,
        user: {
          connect: {
            id: input.id
          }
        }
      }
    })
  }),

  removeAdmin: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    if (ctx.session.user.id === input) {
      throw new Error("You can't remove yourself from admin.")
    }
    return await ctx.db.admin.delete({
      where: {
        userId: input
      }
    })
  }),
});
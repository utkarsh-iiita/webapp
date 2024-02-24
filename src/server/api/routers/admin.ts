import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getAdmins: adminProcedure
    .input(
      z.object({
        permissions: z.number(),
        query: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.admin.findMany({
        where: {
          user: {
            AND: [
              {
                NOT: {
                  id: ctx.session.user.id,
                },
              },
              {
                ...(input.query && {
                  OR: [
                    {
                      name: {
                        contains: input.query,
                      },
                    },
                    {
                      username: {
                        contains: input.query,
                      },
                    },
                  ],
                }),
              },
              {
                admin: {
                  permissions: input.permissions,
                },
              },
            ],
          },
        },
        select: {
          permissions: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              userGroup: true,
            },
          },
        },
      });
    }),

  createAdmin: adminProcedure
    .input(
      z.object({
        id: z.string(),
        permissions: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id === input.id) {
        throw new Error("You can't make yourself admin.");
      }
      return await ctx.db.admin.create({
        data: {
          permissions: input.permissions,
          user: {
            connect: {
              id: input.id,
            },
          },
        },
      });
    }),

  removeAdmin: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id === input) {
        throw new Error("You can't remove yourself from admin.");
      }
      return await ctx.db.admin.delete({
        where: {
          userId: input,
        },
      });
    }),

  updateAdminPermission: adminProcedure
    .input(
      z.object({
        id: z.string(),
        permissions: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id == input.id) {
        throw new Error("You cannot make yourself admin.");
      }
      return await ctx.db.admin.update({
        where: {
          userId: input.id,
        },
        data: {
          permissions: input.permissions,
        },
      });
    }),

  raiseAdminRequest: protectedProcedure.mutation(async ({ ctx }) => {
    const admin = await ctx.db.admin.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });
    if (admin) {
      throw new Error("You are already an admin.");
    }
    return await ctx.db.admin.create({
      data: {
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        permissions: 0,
      },
    });
  }),
});

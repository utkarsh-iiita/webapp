import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

//not working yet need some dummy data.
export const userRouter = createTRPCRouter({
  getUserGroups: adminProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.students.groupBy({
      by: ["admissionYear", "program"],
    });

    let result = data;
    // data.forEach((item) => {
    //   result[item] = item.programs;
    // });
    return result;
  }),

  searchUser: adminProcedure.input(z.object({
    q: z.string(),
    exclude: z.array(z.string()).optional(),
    include: z.array(z.string()).optional(),
    isAdmin: z.boolean().optional(),
  })).query(async ({ ctx, input }) => {
    const data = await ctx.db.user.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: input.q,
                },
              },
              {
                username: {
                  contains: input.q,
                },
              },
            ]
          },
          {
            OR: [
              {
                ...input.exclude && {
                  NOT: {
                    id: {
                      in: input.exclude,
                    }
                  }
                }
              },
              {
                ...input.include && {
                  id: {
                    in: input.include,
                  }
                }
              }
            ]
          },
          {
            ...input.isAdmin !== undefined && {
              admin: {
                ...input.isAdmin ? {
                  isNot: null,
                } : {
                  is: null,
                }
              }
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
      },
      take: 10,
    });
    return data;
  }),
});

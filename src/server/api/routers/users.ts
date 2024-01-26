import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

//not working yet need some dummy data.
export const userRouter = createTRPCRouter({
  getUserGroups: adminProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.students.groupBy({
      by: ["admissionYear", "program"],
    });

    let result = {};
    // data.forEach((item) => {
    //   result[item] = item.programs;
    // });
    return result;
  }),

  searchUser: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await ctx.db.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: input,
            },
          },
          {
            username: {
              contains: input,
            },
          }
        ],
      },
    });
    return data;
  }),
});

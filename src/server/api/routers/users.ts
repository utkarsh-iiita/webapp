import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

//not working yet need some dummy data.
export const userRouter = createTRPCRouter({
  getUserGroups: adminProcedure.input(z.object({})).query(async ({ ctx }) => {
    const data = await ctx.db.students.groupBy({
      by: ["admissionYear", "program"],
    });

    let result = {};
    data.forEach((item) => {
      result[item] = item.programs;
    });
    return result;
  }),
});

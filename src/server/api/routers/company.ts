import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const companyRouter = createTRPCRouter({
  getCompanyUser: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const company = await ctx.db.company.findUnique({
        where: {
          id: input,
        },
        select: {
          name: true,
          logo: true,
          website: true,
          description: true,
        },
      });
      return company;
    }),
});

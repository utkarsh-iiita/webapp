import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const placementConfigRouter = createTRPCRouter({
  getPlacementYears: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.participatingGroups.groupBy({
      by: ["year"],
    });
    return data.map((el) => el.year);
  }),
  getPlacementTypes: adminProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.placementType.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return data;
  }),
  getYearwisePrograms: adminProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.students.groupBy({
      by: ["admissionYear", "program"],
    });

    const yearWisePrograms: {
      [key: number]: string[];
    } = {};

    data.forEach((el) => {
      if (!yearWisePrograms[el.admissionYear]) {
        yearWisePrograms[el.admissionYear] = [];
      }
      yearWisePrograms[el.admissionYear].push(el.program);
    });

    return yearWisePrograms;
  }),
  createParticipatingGroups: adminProcedure
    .input(
      z.object({
        year: z.number(),
        placementConfigs: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            batches: z.array(
              z.object({
                program: z.string(),
                admissionYear: z.number(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const allGroups = [];
      for (const config of input.placementConfigs) {
        for (const batch of config.batches) {
          allGroups.push({
            year: input.year,
            placementTypeId: config.id,
            program: batch.program,
            admissionYear: batch.admissionYear,
          });
        }
      }
      await ctx.db.participatingGroups.createMany({
        data: allGroups,
      });
      return true;
    }),
});

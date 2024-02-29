import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const jobOpeningRouter = createTRPCRouter({
  getJobOpeningsForStudent: protectedProcedure
    .input(
      z.object({
        includeNonEligible: z.boolean().default(true),
        page: z.number().min(1).default(1),
        pageSize: z.number().max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userStudent = await ctx.db.students.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });
      if (!userStudent) {
        throw new Error("User is not a student");
      }
      const data = await ctx.db.jobOpening.findMany({
        where: {
          OR: [
            {
              autoVisible: false,
              hidden: false,
            },
            {
              autoVisible: true,
              registrationStart: {
                lte: new Date(),
              },
            },
          ],
          JobOpeningParticipantGroups: {
            some: {
              participatingGroup: {
                year: ctx.session.user.year,
                admissionYear: userStudent.admissionYear,
                program: userStudent.program,
              },
              minCgpa: {
                lte: userStudent.cgpa,
              },
              minCredits: {
                lte: userStudent.completedCredits,
              },
            },
          },
        },
        select: {
          company: {
            select: {
              logo: true,
              name: true,
              website: true,
              description: true,
            },
          },
          title: true,
          payTotal: true,
          location: true,
        },
        take: input.pageSize,
        skip: (input.page - 1) * input.pageSize,
      });
      return data;
    }),
});

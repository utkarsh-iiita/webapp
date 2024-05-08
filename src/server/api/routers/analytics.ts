import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const analyticsRouter = createTRPCRouter({
  getJobTypes: adminProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.placementType.findMany({
      where: {
        ParticipatingGroups: {
          some: {
            year: ctx.session.user.year,
          },
        },
      },
    });
    return data;
  }),

  getJobTypeSelectionAnalytics: adminProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const groups = await ctx.db.participatingGroups.findMany({
        where: {
          placementTypeId: input,
          year: ctx.session.user.year,
        },
      });

      const dbData = await ctx.db.$transaction([
        ...groups.map((grp) => {
          return ctx.db.students.count({
            where: {
              admissionYear: grp.admissionYear,
              program: grp.program,
            },
            select: {
              _all: true,
            },
          });
        }),
        ...groups.map((grp) => {
          return ctx.db.students.count({
            where: {
              admissionYear: grp.admissionYear,
              program: grp.program,
              selections: {
                some: {
                  year: ctx.session.user.year,
                  jobType: input,
                },
              },
            },
            select: {
              _all: true,
            },
          });
        }),
      ]);
      let i = 0;
      const data: {
        group: (typeof groups)[number];
        all: number;
        selected: number;
      }[] = [];
      let totalCnt = 0;
      let selectedCnt = 0;
      for (i = 0; i < groups.length; i++) {
        let allData = dbData[i];
        let selectedData = dbData[i + groups.length];
        totalCnt += allData["_all"];
        selectedCnt += selectedData["_all"];
        data.push({
          group: groups[i],
          all: allData["_all"],
          selected: selectedData["_all"],
        });
      }
      data.push({
        group: {
          id: "total",
          year: ctx.session.user.year,
          admissionYear: null,
          program: "Unselected",
          placementTypeId: input,
        },
        all: totalCnt,
        selected: totalCnt - selectedCnt,
      });

      return data;
    }),

  getJobTypePaymentAnalytics: adminProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.$transaction([
        // @ts-ignore
        ctx.db.selectedStudents.groupBy({
          by: "payNumeric",
          _count: {
            payNumeric: true,
          },
          _min: {
            payNumeric: true,
          },
          _max: {
            payNumeric: true,
          },
          where: {
            year: ctx.session.user.year,
            jobType: input,
          },
        }),
        // @ts-ignore
        ctx.db.selectedStudents.groupBy({
          by: "basePay",
          _count: {
            basePay: true,
          },
          _min: {
            basePay: true,
          },
          _max: {
            basePay: true,
          },
          where: {
            year: ctx.session.user.year,
            jobType: input,
          },
        }),
        // @ts-ignore
        ctx.db.selectedStudents.groupBy({
          by: "stipend",
          _count: {
            stipend: true,
          },
          _min: {
            stipend: true,
          },
          _max: {
            stipend: true,
          },
          where: {
            year: ctx.session.user.year,
            jobType: input,
          },
        }),
      ]);
      return data;
    }),
});

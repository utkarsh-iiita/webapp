import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const jobOpeningRouter = createTRPCRouter({
  createJobOpening: adminProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        location: z.string(),
        role: z.string(),
        pay: z.string(),
        payNumeric: z.number(),
        empBenefits: z.string().optional(),
        company: z.object({
          name: z.string(),
          domain: z.string(),
          logo: z.string(),
        }),
        jobType: z.string(),
        registrationStart: z.date(),
        registrationEnd: z.date(),
        extraApplicationFields: z.any(),
        hidden: z.boolean().optional().default(false),
        autoApprove: z.boolean().optional().default(false),
        autoVisible: z.boolean().optional().default(false),
        participatingGroups: z.array(
          z.object({
            admissionYear: z.number(),
            program: z.string(),
            minCgpa: z.number().max(10).optional().default(0),
            minCredits: z.number().optional().default(0),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // check if company exists
      let company = await ctx.db.company.findUnique({
        where: { website: input.company.domain },
        select: { id: true },
      });

      if (!company) {
        company = await ctx.db.company.create({
          data: {
            name: input.company.name,
            website: input.company.domain,
            logo: input.company.logo,
          },
          select: { id: true },
        });
      }

      await ctx.db.jobOpening.create({
        data: {
          year: ctx.session.user.year,
          title: input.title,
          description: input.description,
          location: input.location,
          role: input.role,
          pay: input.pay,
          payNumeric: input.payNumeric,
          empBenefits: input.empBenefits,
          company: {
            connect: { id: company.id },
          },
          placementType: {
            connect: {
              id: input.jobType,
            },
          },
          registrationStart: input.registrationStart,
          registrationEnd: input.registrationEnd,
          extraApplicationFields:
            typeof input.extraApplicationFields === "object"
              ? input.extraApplicationFields
              : undefined,
          hidden: input.hidden,
          autoApprove: input.autoApprove,
          autoVisible: input.autoVisible,
          JobOpeningParticipantGroups: {
            createMany: {
              data: input.participatingGroups.map((group) => ({
                admissionYear: group.admissionYear,
                program: group.program,
                minCgpa: group.minCgpa,
                minCredits: group.minCredits,
              })),
            },
          },
        },
      });

      return true;
    }),

  updateJobOpening: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        location: z.string(),
        role: z.string(),
        pay: z.string(),
        payNumeric: z.number(),
        empBenefits: z.string().optional(),
        company: z.object({
          name: z.string(),
          domain: z.string(),
          logo: z.string(),
        }),
        jobType: z.string(),
        registrationStart: z.date(),
        registrationEnd: z.date(),
        extraApplicationFields: z.any(),
        hidden: z.boolean().optional().default(false),
        autoApprove: z.boolean().optional().default(false),
        autoVisible: z.boolean().optional().default(false),
        participatingGroups: z.array(
          z.object({
            id: z.string().optional(),
            admissionYear: z.number(),
            program: z.string(),
            minCgpa: z.number().max(10).optional().default(0),
            minCredits: z.number().optional().default(0),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // check if company exists
      let company = await ctx.db.company.findUnique({
        where: { website: input.company.domain },
        select: { id: true },
      });

      if (!company) {
        company = await ctx.db.company.create({
          data: {
            name: input.company.name,
            website: input.company.domain,
            logo: input.company.logo,
          },
          select: { id: true },
        });
      }

      let tasks = [];

      tasks.push(
        ctx.db.jobOpeningParticipantGroups.deleteMany({
          where: {
            id: {
              notIn: input.participatingGroups
                .filter((group) => group.id)
                .map((group) => group.id),
            },
            jobOpeningId: input.id,
          },
        }),
      );

      input.participatingGroups
        .filter((group) => group.id)
        .forEach((group) => {
          tasks.push(
            ctx.db.jobOpeningParticipantGroups.update({
              where: {
                id: group.id,
              },
              data: {
                admissionYear: group.admissionYear,
                program: group.program,
                minCgpa: group.minCgpa,
                minCredits: group.minCredits,
              },
            }),
          );
        });

      tasks.push(
        ctx.db.jobOpening.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            description: input.description,
            location: input.location,
            role: input.role,
            pay: input.pay,
            payNumeric: input.payNumeric,
            empBenefits: input.empBenefits,
            company: {
              connect: { id: company.id },
            },
            placementType: {
              connect: {
                id: input.jobType,
              },
            },
            registrationStart: input.registrationStart,
            registrationEnd: input.registrationEnd,
            extraApplicationFields:
              typeof input.extraApplicationFields === "object"
                ? input.extraApplicationFields
                : undefined,
            hidden: input.hidden,
            autoApprove: input.autoApprove,
            autoVisible: input.autoVisible,
            JobOpeningParticipantGroups: {
              createMany: {
                data: input.participatingGroups
                  .filter((group) => !group.id)
                  .map((group) => ({
                    admissionYear: group.admissionYear,
                    program: group.program,
                    minCgpa: group.minCgpa,
                    minCredits: group.minCredits,
                  })),
              },
            },
          },
        }),
      );

      await Promise.all(tasks);
      return true;
    }),
  deleteJobOpening: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.jobOpening.delete({
        where: {
          id: input,
        },
      });
      return true;
    }),
  getLatestJobOpenings: protectedProcedure
    .input(
      z.object({
        onlyApplicable: z.boolean().default(false),
        limit: z.number().default(10),
        page: z.number().default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.userGroup === "student") {
        throw new Error("Only students can view job openings");
      }
      const userDetails = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          student: {
            select: {
              admissionYear: true,
              program: true,
              cgpa: true,
              completedCredits: true,
            },
          },
        },
      });
      const jobOpenings = await ctx.db.jobOpeningParticipantGroups.findMany({
        where: {
          ...(input.onlyApplicable && {
            admissionYear: userDetails.student.admissionYear,
            program: userDetails.student.program,
            minCgpa: {
              lte: userDetails.student.cgpa,
            },
            minCredits: {
              lte: userDetails.student.completedCredits,
            },
          }),
          jobOpening: {
            OR: [
              {
                hidden: false,
              },
              {
                AND: [
                  {
                    registrationStart: {
                      lte: new Date(),
                    },
                  },
                  {
                    autoVisible: true,
                  },
                ],
              },
            ],
          },
        },
        select: {
          admissionYear: true,
          program: true,
          minCgpa: true,
          minCredits: true,
          jobOpening: {
            select: {
              id: true,
              title: true,
              location: true,
              role: true,
              pay: true,
              company: {
                select: {
                  name: true,
                  website: true,
                  logo: true,
                },
              },
              placementType: {
                select: {
                  name: true,
                },
              },
              applications: {
                where: {
                  userId: ctx.session.user.id,
                },
                select: {
                  id: true,
                },
              },
              registrationStart: true,
              registrationEnd: true,
            },
          },
        },
        orderBy: {
          jobOpening: {
            registrationStart: "desc",
          },
        },
        take: input.limit + 1,
        skip: (input.page - 1) * input.limit,
      });

      const data = jobOpenings.map((jobOpening) => ({
        ...jobOpening.jobOpening,
        canRegister:
          jobOpening.admissionYear === userDetails.student.admissionYear &&
          jobOpening.program === userDetails.student.program &&
          jobOpening.minCgpa <= userDetails.student.cgpa &&
          jobOpening.minCredits <= userDetails.student.completedCredits,
      }));

      return {
        data: data.slice(0, input.limit),
        hasMore: data.length > input.limit,
      };
    }),
  getJobOpening: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const jobOpening = await ctx.db.jobOpening.findUnique({
        where: {
          id: input,
          hidden: false,
        },
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          role: true,
          pay: true,
          empBenefits: true,
          company: {
            select: {
              name: true,
              website: true,
              logo: true,
            },
          },
          placementType: {
            select: {
              name: true,
            },
          },
          applications: {
            where: {
              userId: ctx.session.user.id,
            },
            select: {
              id: true,
            },
          },
          registrationStart: true,
          registrationEnd: true,
          extraApplicationFields: true,
          JobOpeningParticipantGroups: {
            select: {
              id: true,
              admissionYear: true,
              program: true,
              minCgpa: true,
              minCredits: true,
            },
          },
        },
      });

      return jobOpening;
    }),
  adminGetJobOpenings: adminProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        page: z.number().default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const jobOpenings = await ctx.db.jobOpening.findMany({
        where: {
          year: ctx.session.user.year,
        },
        select: {
          id: true,
          title: true,
          location: true,
          role: true,
          pay: true,
          company: {
            select: {
              name: true,
              website: true,
              logo: true,
            },
          },
          placementType: {
            select: {
              name: true,
            },
          },
          registrationStart: true,
          registrationEnd: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit + 1,
        skip: (input.page - 1) * input.limit,
      });

      return {
        data: jobOpenings.slice(0, input.limit),
        hasMore: jobOpenings.length > input.limit,
      };
    }),
  adminGetJobOpening: adminProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.jobOpening.findUnique({
        where: {
          id: input,
        },
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          role: true,
          pay: true,
          empBenefits: true,
          company: {
            select: {
              name: true,
              website: true,
              logo: true,
            },
          },
          placementType: {
            select: {
              name: true,
            },
          },
          registrationStart: true,
          registrationEnd: true,
          extraApplicationFields: true,
          hidden: true,
          autoApprove: true,
          autoVisible: true,
          JobOpeningParticipantGroups: {
            select: {
              id: true,
              admissionYear: true,
              program: true,
              minCgpa: true,
              minCredits: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
      });
    }),
});

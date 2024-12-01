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
        noResumes: z.boolean().optional().default(false),
        hidden: z.boolean().optional().default(false),
        autoApprove: z.boolean().optional().default(false),
        autoVisible: z.boolean().optional().default(false),
        allowSelected: z.boolean().optional().default(false),
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
          noResumes: input.noResumes,
          hidden: input.hidden,
          autoApprove: input.autoApprove,
          autoVisible: input.autoVisible,
          allowSelected: input.allowSelected,
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
        noResumes: z.boolean().optional().default(false),
        hidden: z.boolean().optional().default(false),
        autoApprove: z.boolean().optional().default(false),
        autoVisible: z.boolean().optional().default(false),
        allowSelected: z.boolean().optional().default(false),
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
            noResumes: input.noResumes,
            hidden: input.hidden,
            autoApprove: input.autoApprove,
            autoVisible: input.autoVisible,
            allowSelected: input.allowSelected,
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
      if (ctx.session.user.userGroup !== "student") {
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
              selections: {
                where: {
                  year: ctx.session.user.year,
                },
              },
            },
          },
        },
      });
      const query = {
        admissionYear: userDetails.student.admissionYear,
        program: userDetails.student.program,
        ...(input.onlyApplicable && {
          minCgpa: {
            lte: userDetails.student.cgpa,
          },
          minCredits: {
            lte: userDetails.student.completedCredits,
          },
        }),
        jobOpening: {
          year: ctx.session.user.year,
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
      };
      const [total, jobOpenings] = await ctx.db.$transaction([
        ctx.db.jobOpeningParticipantGroups.count({
          where: query,
        }),
        ctx.db.jobOpeningParticipantGroups.findMany({
          where: query,
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
                    id: true,
                    name: true,
                  },
                },
                applications: {
                  where: {
                    userId: ctx.session.user.id,
                  },
                  select: {
                    id: true,
                    latestStatus: {
                      select: {
                        status: true,
                      },
                    },
                  },
                },
                allowSelected: true,
                registrationStart: true,
                registrationEnd: true,
                createdAt: true,
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
        }),
      ]);

      const data = jobOpenings.map((jobOpening) => ({
        ...jobOpening.jobOpening,
        canRegister:
          (jobOpening.jobOpening.allowSelected ||
            userDetails.student.selections.filter(
              (sel) => sel.jobType === jobOpening.jobOpening.placementType.id,
            ).length === 0) &&
          jobOpening.admissionYear === userDetails.student.admissionYear &&
          jobOpening.program === userDetails.student.program &&
          jobOpening.minCgpa <= userDetails.student.cgpa &&
          jobOpening.minCredits <= userDetails.student.completedCredits,
        alreadyRegistered: jobOpening.jobOpening.applications.length > 0,
      }));

      return {
        data: data.slice(0, input.limit),
        total,
        hasMore: data.length > input.limit,
      };
    }),

  getJobOpening: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.userGroup !== "student") {
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
              selections: {
                where: {
                  year: ctx.session.user.year,
                },
              },
            },
          },
        },
      });
      const jobOpening = await ctx.db.jobOpening.findUnique({
        where: {
          id: input,
          hidden: false,
          year: ctx.session.user.year,
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
              id: true,
              name: true,
            },
          },
          applications: {
            where: {
              userId: ctx.session.user.id,
            },
            select: {
              id: true,
              latestStatus: {
                select: {
                  status: true,
                },
              },
            },
          },
          allowSelected: true,
          registrationStart: true,
          registrationEnd: true,
          JobOpeningParticipantGroups: {
            select: {
              id: true,
              admissionYear: true,
              program: true,
              minCgpa: true,
              minCredits: true,
            },
          },
          createdAt: true,
        },
      });

      type JobOpening = typeof jobOpening;
      type Data = {
        canRegister: boolean;
        alreadyRegistered: boolean;
      };

      const data: JobOpening & Data = {
        ...jobOpening,
        canRegister: false,
        alreadyRegistered: false,
      };

      delete data.JobOpeningParticipantGroups;

      if (jobOpening) {
        data.canRegister =
          (jobOpening.allowSelected ||
            userDetails.student.selections.filter(
              (sel) => sel.jobType === jobOpening.placementType.id,
            ).length === 0) &&
          jobOpening.JobOpeningParticipantGroups.some(
            (group) =>
              group.admissionYear === userDetails.student.admissionYear &&
              group.program === userDetails.student.program &&
              group.minCgpa <= userDetails.student.cgpa &&
              group.minCredits <= userDetails.student.completedCredits,
          );

        data.alreadyRegistered = jobOpening.applications.length > 0;
      }

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
      const [count, jobOpenings] = await ctx.db.$transaction([
        ctx.db.jobOpening.count({
          where: {
            year: ctx.session.user.year,
          },
        }),
        ctx.db.jobOpening.findMany({
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
          take: input.limit >= 0 ? input.limit + 1 : undefined,
          skip: (input.page - 1) * (input.limit >= 0 ? input.limit : 0),
        }),
      ]);

      return {
        data:
          input.limit >= 0 ? jobOpenings.slice(0, input.limit) : jobOpenings,
        total: count,
        hasMore: input.limit >= 0 && jobOpenings.length > input.limit,
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
          payNumeric: true,
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
              id: true,
              name: true,
            },
          },
          registrationStart: true,
          registrationEnd: true,
          extraApplicationFields: true,
          noResumes: true,
          hidden: true,
          autoApprove: true,
          autoVisible: true,
          allowSelected: true,
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
    }),

  adminGetRegDetails: adminProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.students.groupBy({
        by: ["admissionYear", "program"],
        where: {
          applications: {
            some: {
              jobId: input,
            },
          },
        },
        _count: {
          _all: true,
        },
      });
    }),
});

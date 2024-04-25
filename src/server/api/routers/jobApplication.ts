import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

import { getFilterQuery, getOrderQuery } from "./utils/jobApplications";

export const jobApplication = createTRPCRouter({
  getRegistrationDetails: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
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

      const job = await ctx.db.jobOpening.findUnique({
        where: {
          id: input,
          year: ctx.session.user.year,
          JobOpeningParticipantGroups: {
            some: {
              admissionYear: userDetails.student.admissionYear,
              program: userDetails.student.program,
              minCgpa: {
                lte: userDetails.student.cgpa,
              },
              minCredits: {
                lte: userDetails.student.completedCredits,
              },
            },
          },
          registrationEnd: {
            gte: new Date(),
          },
          registrationStart: {
            lte: new Date(),
          },
          applications: {
            none: {
              student: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
        select: {
          id: true,
          title: true,
          company: {
            select: {
              name: true,
            },
          },
          extraApplicationFields: true,
          noResumes: true,
        },
      });

      if (!job) {
        throw new Error("Job not found");
      }

      return job;
    }),
  createApplication: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        resumeId: z.string().optional(),
        additionalInfo: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userDetails = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          student: {
            select: {
              resume: {
                where: {
                  id: input.resumeId,
                },
              },
              admissionYear: true,
              program: true,
              cgpa: true,
              completedCredits: true,
            },
          },
        },
      });

      if (!userDetails) {
        throw new Error("User not found");
      }

      if (!userDetails.student) {
        throw new Error("Student not found");
      }

      if (!userDetails.student.resume) {
        throw new Error("Resume not found");
      }

      const job = await ctx.db.jobOpening.findUnique({
        where: {
          id: input.jobId,
          year: ctx.session.user.year,
          JobOpeningParticipantGroups: {
            some: {
              admissionYear: userDetails.student.admissionYear,
              program: userDetails.student.program,
              minCgpa: {
                lte: userDetails.student.cgpa,
              },
              minCredits: {
                lte: userDetails.student.completedCredits,
              },
            },
          },
          registrationEnd: {
            gte: new Date(),
          },
          registrationStart: {
            lte: new Date(),
          },
          applications: {
            none: {
              student: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
        select: {
          autoApprove: true,
        },
      });

      if (!job) {
        throw new Error("Job not found");
      }

      const application = await ctx.db.application.create({
        data: {
          jobOpening: {
            connect: {
              id: input.jobId,
            },
          },
          student: {
            connect: {
              userId: ctx.session.user.id,
            },
          },
          resume: {
            connect: {
              id: input.resumeId,
            },
          },
          additionalInfo: input.additionalInfo,
          applicationStatus: {
            create: {
              status: job.autoApprove ? "APPROVED" : "REGISTERED",
            },
          },
        },
        select: {
          id: true,
          applicationStatus: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      await ctx.db.application.update({
        where: {
          id: application.id,
        },
        data: {
          latestStatus: {
            connect: {
              id: application.applicationStatus[0].id,
            },
          },
        },
      });

      return application;
    }),
  getJobApplicants: adminProcedure
    .input(
      z.object({
        jobId: z.string(),
        filterColumn: z.string().optional(),
        filterValue: z.string().optional(),
        page: z.number().optional(),
        pageSize: z.number().optional(),
        orderBy: z.string().optional(),
        sort: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const filters = getFilterQuery(input.filterColumn, input.filterValue);
      const [total, data] = await ctx.db.$transaction([
        ctx.db.application.count({
          where: {
            jobId: input.jobId,
            ...filters,
          },
        }),
        ctx.db.application.findMany({
          where: {
            jobId: input.jobId,
            ...filters,
          },
          include: {
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                    username: true,
                  },
                },
              },
            },
            latestStatus: {
              select: {
                status: true,
              },
            },
            resume: {
              select: {
                src: true,
              },
            },
          },
          orderBy: [getOrderQuery(input.orderBy, input.sort)],
          skip: input.page * input.pageSize,
          take: input.pageSize + 1,
        }),
      ]);
      const hasMore = data.length > input.pageSize;
      if (hasMore) {
        data.pop();
      }
      return {
        total,
        data: data.map((application) => ({
          ...application.student.user,
          ...application.student,
          resume: application.resume.src,
          status: application.latestStatus.status,
          additionalInfo: application.additionalInfo,
          createdAt: application.createdAt,
          id: application.id,
        })),
        hasMore,
      };
    }),
});

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

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
              totalCredits: true,
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
                lte: userDetails.student.totalCredits,
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
              totalCredits: true,
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
                lte: userDetails.student.totalCredits,
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
});

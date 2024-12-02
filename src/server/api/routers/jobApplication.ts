import dayjs from "dayjs";
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
              selections: {
                where: {
                  year: ctx.session.user.year,
                },
              },
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
          allowSelected: true,
          extraApplicationFields: true,
          noResumes: true,
          placementType: {
            select: {
              id: true,
            },
          },
        },
      });

      if (
        !job.allowSelected &&
        userDetails.student.selections.filter(
          (sel) => sel.jobType === job.placementType.id,
        ).length > 0
      ) {
        throw new Error("You have already selected a job for this year");
      }

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
              selections: {
                where: {
                  year: ctx.session.user.year,
                },
              },
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
          noResumes: true,
          placementType: {
            select: {
              id: true,
            },
          },
          allowSelected: true,
        },
      });

      if (
        !job.allowSelected &&
        userDetails.student.selections.filter(
          (sel) => sel.jobType === job.placementType.id,
        ).length > 0
      ) {
        throw new Error("You have already selected a job for this year");
      }
      0;

      if (!job.noResumes && !userDetails.student.resume) {
        throw new Error("Resume not found");
      }

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
        query: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const filters = getFilterQuery(input.filterColumn, input.filterValue);
      const jobPlacementType = await ctx.db.jobOpening.findUnique({
        where: {
          id: input.jobId,
        },
        select: {
          placementType: {
            select: {
              id: true,
            },
          },
        },
      });
      const [total, data] = await ctx.db.$transaction([
        ctx.db.application.count({
          where: {
            jobId: input.jobId,
            ...(input.query
              ? {
                student: {
                  user: {
                    OR: [
                      {
                        name: {
                          contains: input.query,
                        },
                      },
                      {
                        username: {
                          contains: input.query,
                        },
                      },
                    ],
                  },
                },
              }
              : {}),
            ...filters,
          },
        }),
        ctx.db.application.findMany({
          where: {
            jobId: input.jobId,
            ...(input.query
              ? {
                student: {
                  user: {
                    OR: [
                      {
                        name: {
                          contains: input.query,
                        },
                      },
                      {
                        username: {
                          contains: input.query,
                        },
                      },
                    ],
                  },
                },
              }
              : {}),
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
                selections: {
                  where: {
                    year: ctx.session.user.year,
                    jobType: jobPlacementType.placementType.id,
                    jobOpeningId: {
                      not: input.jobId,
                    },
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
          alreadySelected: application.student.selections.length > 0,
          resume: application.resume.src,
          status: application.latestStatus.status,
          additionalInfo: application.additionalInfo,
          createdAt: application.createdAt,
          id: application.id,
        })),
        hasMore,
      };
    }),
  getJobApplicantsCSV: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const jobPlacementType = await ctx.db.jobOpening.findUnique({
        where: {
          id: input,
        },
        select: {
          title: true,
          company: {
            select: {
              name: true,
            },
          },
          placementType: {
            select: {
              id: true,
            },
          },
        },
      });
      const data = await ctx.db.application.findMany({
        where: {
          jobId: input,
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
              selections: {
                where: {
                  year: ctx.session.user.year,
                  jobType: jobPlacementType.placementType.id,
                  jobOpeningId: {
                    not: input,
                  },
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
      });

      const csvHeaders = [
        "Name",
        "Enrollment No.",
        "Status",
        "Resume",
        "Program",
        "CGPA",
        "Email",
        "Phone",
        "Gender",
        "Tenth Score",
        "Twelfth Score",
        "Admission Year",
        "Submitted At",
      ];

      const extraCols = [];

      const csvData = data.map((application) => {
        let rowData = [
          application.student.user.name,
          application.student.user.username,
          application.latestStatus.status,
          application.resume.src,
          application.student.program,
          application.student.cgpa,
          application.student.email,
          application.student.phone,
          application.student.gender,
          application.student.tenthMarks,
          application.student.twelvethMarks,
          application.student.admissionYear,
          application.createdAt,
        ];
        if (
          application.additionalInfo &&
          Object.keys(application.additionalInfo).length > 0
        ) {
          Object.keys(application.additionalInfo).forEach((key) => {
            if (!extraCols.includes(key)) {
              extraCols.push(key);
            }
          });
        }
        extraCols.forEach((col) => {
          rowData.push(application.additionalInfo[col] || "");
        });

        return rowData;
      });

      const csv = [[...csvHeaders, ...extraCols], ...csvData];
      const csvString = csv.map((row) => row.join(",")).join("\n");
      const csvTitle = `${jobPlacementType.company.name}-${
        jobPlacementType.title
      }-${dayjs().format("DD_MM_YYYY_HH_mm_ss_a")}.csv`;
      return { data: csvString, title: csvTitle };
    }),

  upgradeStatus: adminProcedure
    .input(
      z.object({
        applicationId: z.array(z.string()),
        status: z.enum([
          "REGISTERED",
          "APPROVED",
          "REJECTED",
          "SHORTLISTED",
          "SELECTED",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.status === "SELECTED") {
        const selectedStudents = await ctx.db.application.findMany({
          where: {
            id: {
              in: input.applicationId,
            },
          },
          select: {
            student: {
              select: {
                userId: true,
                selections: {
                  where: {
                    year: ctx.session.user.year,
                  },
                },
              },
            },
            jobOpening: {
              select: {
                id: true,
                companyId: true,
                jobType: true,
                year: true,
                role: true,
                payNumeric: true,
                basePay: true,
                stipend: true,
              },
            },
          },
        });
        await ctx.db.selectedStudents.createMany({
          data: selectedStudents.map(({ student, jobOpening }) => ({
            userId: student.userId,
            authorId: ctx.session.user.id,
            jobOpeningId: jobOpening.id,
            companyId: jobOpening.companyId,
            role: jobOpening.role,
            jobType: jobOpening.jobType,
            year: jobOpening.year,
            payNumeric: jobOpening.payNumeric,
            basePay: jobOpening.basePay,
            stipend: jobOpening.stipend,
          })),
        });
      }

      await ctx.db.$transaction(
        input.applicationId.map((id) =>
          ctx.db.application.update({
            where: { id },
            data: {
              latestStatus: {
                create: {
                  status: input.status,
                  Application: {
                    connect: { id },
                  },
                  application: {
                    connect: { id },
                  },
                },
              },
            },
          }),
        ),
      );
      return true;
    }),
  getStudentApplications: protectedProcedure.query(async ({ ctx }) => {
    const applications = await ctx.db.application.findMany({
      where: {
        student: {
          userId: ctx.session.user.id,
        },
        jobOpening: {
          year: ctx.session.user.year,
        },
      },
      include: {
        jobOpening: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        },
        latestStatus: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return applications;
  }),
  getStudentApplication: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const application = await ctx.db.application.findUnique({
        where: {
          id: input,
          student: {
            userId: ctx.session.user.id,
          },
        },
        include: {
          jobOpening: {
            select: {
              id: true,
              title: true,
              company: {
                select: {
                  name: true,
                  logo: true,
                },
              },
            },
          },
          latestStatus: {
            select: {
              status: true,
            },
          },
          applicationStatus: {
            select: {
              status: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      return application;
    }),
});

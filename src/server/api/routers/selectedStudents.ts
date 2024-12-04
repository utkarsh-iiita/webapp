import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "../trpc";
import dayjs from "dayjs";

function getOrderByColumn(col?: string, o?: "asc" | "desc") {
  let order = o ?? "desc";

  switch (col) {
    case "student":
      return {
        student: {
          user: {
            name: order,
          },
        },
      };
    case "username":
      return {
        student: {
          user: {
            username: order,
          },
        },
      };
    case "jobType":
      return {
        placementType: {
          name: order,
        },
      };
    case "company":
      return {
        company: {
          name: order,
        },
      };
    case "jobOpening":
      return {
        jobOpening: {
          id: order,
        },
      };
    case "isOnCampus":
      return {
        isOnCampus: order,
      };
    case "cgpa":
      return {
        student: {
          cgpa: order,
        },
      };
    case "author":
      return {
        author: {
          name: order,
        },
      };
    case "selectedAt":
      return {
        selectedAt: order,
      };
    default:
      return {
        createdAt: order,
      };
  }
}

export const selectedStudentsRouter = createTRPCRouter({
  getSelectedStudents: adminProcedure
    .input(
      z.object({
        page: z.number().min(0).default(0),
        pageSize: z.number().default(1000),
        query: z.string().optional(),
        jobTypes: z.string().nullable().optional(),
        orderBy: z.string().optional(),
        sort: z.union([z.literal("asc"), z.literal("desc")]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = {
        year: ctx.session.user.year,
        ...(input.query
          ? {
            OR: [
              {
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
              },
              {
                company: {
                  OR: [
                    {
                      name: {
                        contains: input.query,
                      },
                    },
                    {
                      website: {
                        contains: input.query,
                      },
                    },
                  ],
                },
              },
            ],
          }
          : {}),
        ...(input.jobTypes
          ? {
            placementType: {
              id: {
                in: [input.jobTypes],
              },
            },
          }
          : {}),
      };
      const [data, total] = await Promise.all([
        ctx.db.selectedStudents.findMany({
          select: {
            id: true,
            student: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                  },
                },
                phone: true,
                email: true,
                admissionYear: true,
                program: true,
                cgpa: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
                website: true,
              },
            },
            jobOpening: {
              select: {
                id: true,
              },
            },
            isOnCampus: true,
            jobType: true,
            placementType: {
              select: {
                name: true,
                id: true,
              },
            },
            basePay: true,
            payNumeric: true,
            stipend: true,
            selectedAt: true,
            author: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
            createdAt: true,
          },
          where: query,
          orderBy: getOrderByColumn(input.orderBy, input.sort),
          take: input.pageSize,
          skip: input.page * input.pageSize,
        }),
        ctx.db.selectedStudents.count({
          where: query,
        }),
      ]);

      return {
        data: data.slice(0, input.pageSize),
        total,
      };
    }),
  getSelectedStudentsCSV: adminProcedure
    .input(
      z.object({
        jobTypes: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const query = {
        year: ctx.session.user.year,
        ...(input.jobTypes
          ? {
            placementType: {
              id: {
                in: [input.jobTypes],
              },
            },
          }
          : {}),
      };
      const data = await ctx.db.selectedStudents.findMany({
        select: {
          id: true,
          student: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
              phone: true,
              email: true,
              admissionYear: true,
              program: true,
              cgpa: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              website: true,
            },
          },
          jobOpening: {
            select: {
              id: true,
            },
          },

          isOnCampus: true,
          jobType: true,
          placementType: {
            select: {
              name: true,
              id: true,
            },
          },
          basePay: true,
          role: true,
          payNumeric: true,
          stipend: true,
          selectedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
          createdAt: true,
        },
        where: query,
      });
      const csvHeaders = [
        "Name",
        "Enrollment No.",
        "Author Name",
        "Author User Name",
        "Year",
        "Job Type",
        "Selected At",
        "Role",
        "Pay (Numberic)",
        "Pay",
        "Stipend",
        "Company Name",
        "Job Opening",
        "On Campus",

      ];

      const extraCols = [];

      const csvData = data.map((select) => {
        let rowData = [
          select.student.user.name,
          select.student.user.username,
          select.author.name,
          select.author.username,
          select.student.admissionYear,
          select.jobType,
          select.selectedAt,
          select.role,
          select.payNumeric,
          select.basePay,
          select.stipend,
          select.company.name,
          select.jobOpening?.id ?? 'N/A',
          select.isOnCampus ? 'Yes' : 'No',
        ];

        return rowData;
      });

      const csv = [[...csvHeaders, ...extraCols], ...csvData];
      const csvString = csv.map((row) => row.join(",")).join("\n");
      const csvTitle = `iiita-selections-${input.jobTypes ? '-' + input.jobTypes : ''}-${dayjs().format("DD_MM_YYYY_HH_mm_ss_a")}.csv`;
      return { data: csvString, title: csvTitle };
    }),

  createSelectedStudent: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        jobType: z.string(),
        selectedAt: z.date(),
        role: z.string(),
        payNumeric: z.number(),
        basePay: z.number(),
        stipend: z.number(),
        company: z.object({
          name: z.string(),
          domain: z.string(),
          logo: z.string(),
        }),
        isOnCampus: z.boolean(),

      })
    ).mutation(async ({ ctx, input }) => {
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
      await ctx.db.selectedStudents.create({
        data: {
          year: ctx.session.user.year,
          selectedAt: input.selectedAt,
          role: input.role,
          payNumeric: input.payNumeric,
          basePay: input.basePay,
          isOnCampus: input.isOnCampus,
          stipend: input.stipend,
          company: {
            connect: { id: company.id },
          },
          student: {
            connect: {
              userId: input.userId
            }
          },
          placementType: {
            connect: {
              id: input.jobType
            }
          },
          author: {
            connect: {
              id: ctx.session.user.id
            }
          }
        }
      })
      return true;

    }),
});



import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "../trpc";

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
        jobTypes: z.array(z.string()).nullable().optional(),
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
                  in: input.jobTypes,
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
});

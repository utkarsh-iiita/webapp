import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { getStudentAviralData } from "~/server/utils/aviral";

export const studentRouter = createTRPCRouter({
  getStudentProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.students.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        admissionYear: true,
        cgpa: true,
        currentSemester: true,
        totalCredits: true,
        completedCredits: true,
        program: true,
        email: true,
        phone: true,
        user: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });
  }),
  updateAviralData: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      let userData = await getStudentAviralData(
        ctx.session.user.username,
        input,
      );
      if (!userData) throw new Error("User Not Found");
      await ctx.db.students.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          program: userData.program,
          admissionYear: userData.admissionYear,
          duration: userData.duration,
          currentSemester: userData.currentSem,
          completedCredits: userData.completedCredits,
          totalCredits: userData.totalCredits,
          cgpa: userData.cgpa,
        },
      });

      return "Ok";
    }),
  updateStudentDetails: protectedProcedure
    .input(
      z.object({
        phone: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { phone, email } }) => {
      await ctx.db.students.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          phone,
          email,
        },
      });

      return "Ok";
    }),
  searchStudent: adminProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const students = await ctx.db.students.findMany({
        where: {
          user: {
            OR: [
              {
                name: {
                  contains: input,
                },
              },
              {
                username: {
                  contains: input,
                },
              },
            ],
          },
        },
        select: {
          user: {
            select: {
              name: true,
              username: true,
            },
          },
          program: true,
        },
        take: 5,
        skip: 0,
      });

      return students;
    }),
  getStudentDetails: adminProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          username: input,
        },
        select: { id: true },
      });

      const student = await ctx.db.students.findUnique({
        where: {
          userId: user.id,
        },
        select: {
          admissionYear: true,
          cgpa: true,
          currentSemester: true,
          totalCredits: true,
          completedCredits: true,
          tenthMarks: true,
          twelvethMarks: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          state: true,
          country: true,
          pincode: true,
          dob: true,
          gender: true,
          program: true,
          email: true,
          phone: true,
          user: {
            select: {
              name: true,
              username: true,
            },
          },
          resume: {
            select: {
              id: true,
              name: true,
              src: true,
              createdAt: true,
            },
          },
          applications: {
            select: {
              id: true,
              jobOpening: {
                select: {
                  id: true,
                  title: true,
                  placementType: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  company: {
                    select: {
                      name: true,
                      logo: true,
                    },
                  },
                  year: true,
                },
              },
              latestStatus: {
                select: {
                  status: true,
                  updatedAt: true,
                },
              },
              statuses: {
                select: {
                  status: true,
                  createdAt: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
              },
              createdAt: true,
            },
            orderBy: {
              updatedAt: "desc",
            },
          },
          selections: {
            select: {
              id: true,
              company: {
                select: {
                  name: true,
                  logo: true,
                },
              },
              placementType: {
                select: {
                  id: true,
                  name: true,
                },
              },
              role: true,
              year: true,
              author: {
                select: {
                  name: true,
                  username: true,
                },
              },
              isOnCampus: true,
              selectedAt: true,
            },
          },
        },
      });

      return student;
    }),
});

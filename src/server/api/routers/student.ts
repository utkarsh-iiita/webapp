import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getStudentAviralData } from "~/server/utils/aviral";

export const studentRouter = createTRPCRouter({
  getStudentProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.students.findUnique({
      where: {
        userId: ctx.session.user.id
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
          }
        }
      }
    })
  }),
  updateAviralData: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    let userData = await getStudentAviralData(
      ctx.session.user.username,
      input
    )
    if (!userData) throw new Error("User Not Found");
    await ctx.db.students.update({
      where: {
        userId: ctx.session.user.id
      },
      data: {
        program: userData.program,
        admissionYear: userData.admissionYear,
        duration: userData.duration,
        currentSemester: userData.currentSem,
        completedCredits: userData.completedCredits,
        totalCredits: userData.totalCredits,
        cgpa: userData.cgpa,
      }
    });

    return "Ok";

  }),
  updateStudentDetails: protectedProcedure.input(z.object({
    phone: z.string().optional(),
    email: z.string().optional(),
  })).mutation(async ({ ctx, input: { phone, email } }) => {
    await ctx.db.students.update({
      where: {
        userId: ctx.session.user.id
      },
      data: {
        phone,
        email,
      }
    });

    return "Ok";

  })
})
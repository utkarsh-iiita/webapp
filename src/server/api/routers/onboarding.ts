import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
export const onboardingRouter = createTRPCRouter({
  createOnboarding: protectedProcedure
    .input(
      z.object({
        gender: z.string(),
        dob: z.date(),
        tenthMarks: z.number(),
        twelvethMarks: z.number(),
        addressLine1: z.string(),
        addressLine2: z.string(),
        pincode: z.number(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        email: z.string(),
        phone: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.students.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          ...input,
          isOnboardingComplete: true,
        },
      });
    }),
});

import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const placementSessionRouter = createTRPCRouter({
  // createSession: adminProcedure
  //   .input(
  //     z.object({
  //       name: z.string().min(1),
  //       id: z.string().min(1),
  //       targets: z.object({
  //         groups: z.array(
  //           z.object({
  //             year: z.number(),
  //             program: z.string(),
  //             minCredits: z.number(),
  //             minCGPA: z.number(),
  //           }),
  //         ),
  //         include: z.object({
  //           type: z.array(z.string()),
  //         }),
  //         exclude: z.object({
  //           type: z.array(z.string()),
  //         }),
  //       }),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const newSession = await ctx.db.placementSession.create({
  //       data: {
  //         name: input.name,
  //         id: input.id,
  //         targets: input.targets,
  //       },
  //     });
  //     let students = [];
  //     input.targets.groups.forEach((group) => {
  //       ctx.db.students
  //         .findMany({
  //           where: {
  //             program: group.program,
  //             admissionYear: group.year,
  //             completedCredits: { gte: group.minCredits },
  //             cgpa: { gte: group.minCGPA },
  //           },
  //           select: {
  //             email: true,
  //             userId: true,
  //           },
  //         })
  //         .then((tempStudents) => {
  //           students.push(tempStudents);
  //         });
  //     });
  //     const includedStudents = await ctx.db.students.findMany({
  //       where: {
  //         email: { in: input.targets.include.type },
  //       },
  //       select: {
  //         email: true,
  //         userId: true,
  //       },
  //     });
  //     students.push(includedStudents);
  //     students = students.filter((student) => {
  //       return !input.targets.exclude.type.includes(student.email);
  //     });
  //     students.forEach((student) => {
  //       ctx.db.placementSessionParticipants.create({
  //         data: {
  //           studentId: student.userId,
  //           placementSessionId: newSession.id,
  //         },
  //       });
  //     });
  //     return students;
  //   }),
});

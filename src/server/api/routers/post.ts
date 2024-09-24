import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getLatestPost: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.post.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
        where: {
          published: true,
          year: ctx.session.user.year,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.pageSize,
        skip: (input.page - 1) * input.pageSize,
      });
      return data;
    }),
  getPost: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.post.findUniqueOrThrow({
        where: {
          published: true,
          id: input,
        },
        select: {
          id: true,
          createdAt: true,
          title: true,
          content: true,
          author: {
            select: {
              name: true,
            },
          },
          participatingGroups: {
            select: {
              admissionYear: true,
              minCgpa: true,
              program: true,
            }
          }
        },
      });
      return data;
    }),
  addNewPost: adminProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        participatingGroups: z.array(
          z.object({
            admissionYear: z.number(),
            program: z.string(),
            minCgpa: z.number().max(10).optional().default(0),

          }),
        ),

      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.create({
        data: {

          title: input.title,
          content: input.content,
          year: ctx.session.user.year,
          authorId: ctx.session.user.id,
          published: true,
          participatingGroups: {
            createMany: {
              data: input.participatingGroups.map((group) => ({
                admissionYear: group.admissionYear,
                program: group.program,
                minCgpa: group.minCgpa,
              })),
            }
          }
        },
      });
      return true;
    }),
  updatePost: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        participatingGroups: z.array(
          z.object({
            admissionYear: z.number(),
            program: z.string(),
            minCgpa: z.number().max(10).optional().default(0),
          }),
        ),

      }),

    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.postParticipantGroups.deleteMany({
        where: {
          postId: input.id
        }
      })


      await ctx.db.post.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.session.user.id,
          published: true,
          participatingGroups: {
            createMany: {
              data: input.participatingGroups.map((group) => ({
                admissionYear: group.admissionYear,
                program: group.program,
                minCgpa: group.minCgpa,
              })),
            }
          }
        },
      });
      return true;
    }),
  deletePost: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.delete({
        where: {
          id: input,
        },
      });

      return true;
    }),
});

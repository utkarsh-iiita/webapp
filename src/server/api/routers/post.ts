import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


export const postRouter = createTRPCRouter({
  getLatestPost: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().max(100).default(10),
      }),
    ).query(async ({ ctx, input }) => {
      const data = await ctx.db.post.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,

        },
        where: {
          published: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.pageSize,
        skip: (input.page - 1) * input.pageSize,
      });
      return data;
    }),
  getPost: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
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
          }
        }
      }
    });
    return data;
  }),
  addNewPost: adminProcedure.input(z.object({
    title: z.string(),
    content: z.string(),
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.post.create({
      data: {
        title: input.title,
        content: input.content,
        authorId: ctx.session.user.id,
        published: true,

      }
    });
    return true;
  }),



});
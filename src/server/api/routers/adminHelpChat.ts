import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

export const adminHelpChatRouter = createTRPCRouter({
  postMessage: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.adminHelpMessage.create({
        data: {
          message: input,
          userId: ctx.session.user.id,
          participantId: ctx.session.user.id,
        },
        select: {
          id: true,
          message: true,
          createdAt: true,
          participantId: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });
      return message;
    }),
  adminPostMessage: adminProcedure
    .input(
      z.object({
        message: z.string(),
        participantId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id === input.participantId) {
        throw new Error("You cannot send message to yourself");
      }
      const message = await ctx.db.adminHelpMessage.create({
        data: {
          message: input.message,
          userId: ctx.session.user.id,
          participantId: input.participantId,
        },
        select: {
          id: true,
          message: true,
          createdAt: true,
          participantId: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });
      return message;
    }),
  getMessages: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().max(100).default(25),
      }),
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.adminHelpMessage.findMany({
        where: {
          participantId: ctx.session.user.id,
        },
        select: {
          id: true,
          message: true,
          createdAt: true,
          participantId: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      });
      return messages;
    }),
  getLatestAdminHelpChats: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().max(100).default(25),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userIds = await ctx.db.adminHelpMessage.groupBy({
        by: ["participantId"],
        _max: {
          createdAt: true,
        },
        having: {
          participantId: {
            not: ctx.session.user.id,
          },
        },
        orderBy: {
          _max: {
            createdAt: "desc",
          },
        },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize + 1,
      });

      const actualUserIds =
        userIds.length > input.pageSize ? userIds.slice(0, -1) : userIds;

      const users = await ctx.db.adminHelpMessage.findMany({
        where: {
          participantId: {
            in: actualUserIds.map((u) => u.participantId),
          },
          createdAt: {
            in: actualUserIds.map((u) => u._max.createdAt),
          },
        },
        select: {
          createdAt: true,
          message: true,
          participantId: true,
          participant: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        data: users,
        hasMore: userIds.length > input.pageSize,
      };
    }),
  getAdminHelpMessages: adminProcedure
    .input(
      z.object({
        participantId: z.string(),
        page: z.number().min(1).default(1),
        pageSize: z.number().max(100).default(25),
      }),
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.adminHelpMessage.findMany({
        where: {
          participantId: input.participantId,
        },
        select: {
          id: true,
          message: true,
          createdAt: true,
          participantId: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      });
      return messages;
    }),
});

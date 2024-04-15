import { z } from "zod";

import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const faqRouter = createTRPCRouter({
    getFaqs: publicProcedure.query(async ({ ctx }) => {
        const data = await ctx.db.faq.findMany({
            select: {
                id: true,
                question: true,
                answer: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });
        return data;
    }),
    addFaq: adminProcedure.input(z.object({
        question: z.string(),
        answer: z.string(),
    })).mutation(async ({ ctx, input }) => {
        await ctx.db.faq.create({
            data: {
                question: input.question,
                answer: input.answer,
                authorId: ctx.session.user.id,
            }
        });
        return true;
    }),
    deleteFaq: adminProcedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            await ctx.db.faq.delete({
                where: {
                    id: input,
                },
            });
            return true;
        }),

});

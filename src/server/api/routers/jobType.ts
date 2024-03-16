import { z } from "zod";

import {
    adminProcedure,
    createTRPCRouter,
} from "~/server/api/trpc";
export const jobTypeRouter = createTRPCRouter({

    getPlacementTypes: adminProcedure.query(async ({ ctx }) => {
        const data = await ctx.db.placementType.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
        return data;
    }),
    updatePlacementType: adminProcedure.input(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string()
    })).mutation(async ({ ctx, input }) => {
        await ctx.db.placementType.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
                description: input.description
            }
        });

        return true;
    }),
    createPlacementType: adminProcedure.input(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string()
    })).mutation(async ({ ctx, input }) => {
        await ctx.db.placementType.create({
            data: {
                id: input.id,
                name: input.name,
                description: input.description
            }
        });

        return true;
    }),
});

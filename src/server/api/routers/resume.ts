import { z } from "zod";

import { env } from "~/env";
import { deleteFile, uploadFile } from "~/server/utils/files";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const studentResumeRouter = createTRPCRouter({
  getStudentResumes: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.studentResume.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        src: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }),

  createStudentResume: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        key: z.string(),
        fileDataUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let { name, key, fileDataUrl } = input;
      key = `${ctx.session.user.username}/${key}.pdf`;

      const blob = await fetch(fileDataUrl).then((res) => res.blob());

      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      try {
        await uploadFile(buffer, key);
      } catch (err) {
        console.error(err);
        throw new Error("Failed to upload file");
      }

      return await ctx.db.studentResume.create({
        data: {
          id: key,
          name,
          src: env.S3_PUBLIC_URL + "/" + key.replace("/", "%2F"),
          userId: ctx.session.user.id,
        },
      });
    }),

  deleteStudentResume: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.db.studentResume.findUnique({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });

      if (!resume) {
        throw new Error("Resume does not exist");
      }

      await deleteFile(input);

      return await ctx.db.studentResume.delete({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });
    }),
});

import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";

import { adminRouter } from "./routers/admin";
import { adminHelpChatRouter } from "./routers/adminHelpChat";
import { jobOpeningRouter } from "./routers/jobOpenings";
import { jobTypeRouter } from "./routers/jobType";
import { placementConfigRouter } from "./routers/placementConfig";
import { studentRouter } from "./routers/student";
import { userRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  admin: adminRouter,
  student: studentRouter,
  placementConfig: placementConfigRouter,
  jobType: jobTypeRouter,
  helpChat: adminHelpChatRouter,
  jobOpenings: jobOpeningRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";

import { adminRouter } from "./routers/admin";
import { adminHelpChatRouter } from "./routers/adminHelpChat";
import { analyticsRouter } from "./routers/analytics";
import { eventsRouter } from "./routers/events";
import { faqRouter } from "./routers/faq";
import { jobApplication } from "./routers/jobApplication";
import { jobOpeningRouter } from "./routers/jobOpenings";
import { jobTypeRouter } from "./routers/jobType";
import { onboardingRouter } from "./routers/onboarding";
import { placementConfigRouter } from "./routers/placementConfig";
import { studentResumeRouter } from "./routers/resume";
import { selectedStudentsRouter } from "./routers/selectedStudents";
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
  faq: faqRouter,
  studentResume: studentResumeRouter,
  onboarding: onboardingRouter,
  jobApplication: jobApplication,
  analytics: analyticsRouter,
  events: eventsRouter,
  selections: selectedStudentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

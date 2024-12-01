import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import { EVENT_TYPES } from "./constants/events";

const EventsListDTO = {
  id: true,
  title: true,
  type: true,
  description: true,
  location: true,
  startTime: true,
  endTime: true,
  hidden: true,
  company: {
    select: {
      id: true,
      logo: true,
      name: true,
      website: true,
    },
  },
  jobOpening: {
    select: {
      id: true,
      title: true,
    },
  },
};

const EventsDTO = {
  ...EventsListDTO,
  link: true,
  participatingGroups: {
    select: {
      participatingGroup: {
        select: {
          id: true,
          placementType: {
            select: {
              id: true,
              name: true,
            },
          },
          admissionYear: true,
          program: true,
        },
      },
    },
  },
  individualParticipants: {
    select: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  },
};

export const eventsRouter = createTRPCRouter({
  getEventsInTimeRange: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.userGroup !== "student") {
        throw new Error("Only students can view job openings");
      }
      const userDetails = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          student: {
            select: {
              admissionYear: true,
              program: true,
            },
          },
        },
      });

      const totalEvents = ctx.db.event.count({
        where: {
          year: ctx.session.user.year,
          OR: [
            {
              participatingGroups: {
                some: {
                  participatingGroup: {
                    admissionYear: userDetails.student.admissionYear,
                    program: userDetails.student.program,
                  },
                },
              },
            },
            {
              individualParticipants: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          ],
          hidden: false,
        },
      });
      const eventsQuery = ctx.db.event.findMany({
        where: {
          startTime: {
            lte: input.endDate,
            gte: input.startDate,
          },
          year: ctx.session.user.year,
          OR: [
            {
              participatingGroups: {
                some: {
                  participatingGroup: {
                    admissionYear: userDetails.student.admissionYear,
                    program: userDetails.student.program,
                  },
                },
              },
            },
            {
              individualParticipants: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          ],
          hidden: false,
        },
        select: EventsListDTO,
      });
      const [events, total] = await Promise.all([eventsQuery, totalEvents]);

      return {
        events,
        total,
      };
    }),

  getPaginatedEvents: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        size: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.userGroup !== "student") {
        throw new Error("Only students can view job openings");
      }
      const userDetails = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          student: {
            select: {
              admissionYear: true,
              program: true,
            },
          },
        },
      });

      const totalEvents = ctx.db.event.count({
        where: {
          year: ctx.session.user.year,
          OR: [
            {
              participatingGroups: {
                some: {
                  participatingGroup: {
                    admissionYear: userDetails.student.admissionYear,
                    program: userDetails.student.program,
                  },
                },
              },
            },
            {
              individualParticipants: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          ],
          hidden: false,
        },
      });

      const eventsQuery = ctx.db.event.findMany({
        where: {
          year: ctx.session.user.year,
          OR: [
            {
              participatingGroups: {
                some: {
                  participatingGroup: {
                    admissionYear: userDetails.student.admissionYear,
                    program: userDetails.student.program,
                  },
                },
              },
            },
            {
              individualParticipants: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          ],
          hidden: false,
        },
        select: EventsListDTO,
        skip: (input.page - 1) * input.size,
        take: input.size,
      });

      const [events, total] = await Promise.all([eventsQuery, totalEvents]);

      return {
        events,
        total,
      };
    }),
  getAdminEventsInTimeRange: adminProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        placementType: z.string().nullable().default(null),
      }),
    )
    .query(async ({ ctx, input }) => {
      const totalEvents = ctx.db.event.count({
        where: {
          year: ctx.session.user.year,
          ...(input.placementType
            ? {
              participatingGroups: {
                some: {
                  participatingGroup: {
                    placementTypeId: input.placementType,
                  },
                },
              },
            }
            : {}),
        },
      });
      const eventsQuery = ctx.db.event.findMany({
        where: {
          startTime: {
            lte: input.endDate,
            gte: input.startDate,
          },
          year: ctx.session.user.year,
          ...(input.placementType
            ? {
              participatingGroups: {
                some: {
                  participatingGroup: {
                    placementTypeId: input.placementType,
                  },
                },
              },
            }
            : {}),
        },
        select: EventsListDTO,
      });
      const [events, total] = await Promise.all([eventsQuery, totalEvents]);

      return {
        events,
        total,
      };
    }),
  getPaginatedAdminEvents: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        size: z.number().default(20),
        placementType: z.string().nullable().default(null),
      }),
    )
    .query(async ({ ctx, input }) => {
      const totalEvents = ctx.db.event.count({
        where: {
          year: ctx.session.user.year,
          ...(input.placementType
            ? {
              participatingGroups: {
                some: {
                  participatingGroup: {
                    placementTypeId: input.placementType,
                  },
                },
              },
            }
            : {}),
        },
      });

      const eventsQuery = ctx.db.event.findMany({
        where: {
          year: ctx.session.user.year,
          ...(input.placementType
            ? {
              participatingGroups: {
                some: {
                  participatingGroup: {
                    placementTypeId: input.placementType,
                  },
                },
              },
            }
            : {}),
        },
        select: EventsListDTO,
        skip: (input.page - 1) * input.size,
        take: input.size,
      });

      const [events, total] = await Promise.all([eventsQuery, totalEvents]);

      return {
        events,
        total,
      };
    }),

  getEventTypes: protectedProcedure.query(() => {
    return EVENT_TYPES;
  }),

  getAdminEvent: adminProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: {
          id: input,
        },
        select: EventsDTO,
      });

      return event;
    }),

  createEvent: adminProcedure
    .input(
      z.object({
        title: z.string(),
        type: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        description: z.string().nullable(),
        location: z.string(),
        link: z.string().nullable(),
        hidden: z.boolean().nullable().default(true),
        jobOpeningId: z.string().nullable().default(null),
        company: z
          .object({
            name: z.string(),
            logo: z.string(),
            website: z.string(),
          })
          .nullable()
          .default(null),
        participatingGroups: z.array(z.string()).nullable(),
        individualParticipants: z.array(z.string()).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let company = null;

      if (input.company) {
        company = await ctx.db.company.findUnique({
          where: { website: input.company.website },
          select: { id: true },
        });

        if (!company) {
          company = await ctx.db.company.create({
            data: {
              name: input.company.name,
              website: input.company.website,
              logo: input.company.logo,
            },
            select: { id: true },
          });
        }
      }

      let newEvent = {
        title: input.title,
        type: input.type,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        description: input.description ? input.description : null,
        location: input.location,
        link: input.link,
        jobOpeningId: input.jobOpeningId ? input.jobOpeningId : null,
        companyId: company ? company.id : null,
        hidden: input.hidden,

        participatingGroups: {
          createMany: {
            data: input.participatingGroups.map((groupId) => ({
              participatingGroupId: groupId,
            })),
          },
        },

        individualParticipants: {
          createMany: {
            data: input.individualParticipants.map((userId) => ({
              userId,
            })),
          },
        },

        year: ctx.session.user.year,
      };

      const event = await ctx.db.event.create({
        data: newEvent,
        select: EventsDTO,
      });

      return event;
    }),
  updateEvent: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        type: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        location: z.string(),
        description: z.string().nullable(),
        link: z.string().nullable(),
        hidden: z.boolean().nullable().default(true),
        jobOpeningId: z.string().nullable().default(null),
        company: z
          .object({
            name: z.string(),
            logo: z.string(),
            website: z.string(),
          })
          .nullable()
          .default(null),
        participatingGroups: z.array(z.string()).nullable(),
        individualParticipants: z.array(z.string()).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let company = null;

      if (input.company) {
        company = await ctx.db.company.findUnique({
          where: { website: input.company.website },
          select: { id: true },
        });

        if (!company) {
          company = await ctx.db.company.create({
            data: {
              name: input.company.name,
              website: input.company.website,
              logo: input.company.logo,
            },
            select: { id: true },
          });
        }
      }

      await Promise.all([
        ctx.db.eventParticipatingGroups.deleteMany({
          where: {
            eventId: {
              equals: input.id,
            },
          },
        }),
        ctx.db.eventIndividualParticipants.deleteMany({
          where: {
            eventId: {
              equals: input.id,
            },
          },
        }),
      ]);

      let newEvent = {
        title: input.title,
        type: input.type,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        description: input.description ? input.description : null,
        location: input.location,
        link: input.link,
        jobOpeningId: input.jobOpeningId ? input.jobOpeningId : null,
        companyId: company ? company.id : null,
        hidden: input.hidden,

        participatingGroups: {
          createMany: {
            data: input.participatingGroups.map((groupId) => ({
              participatingGroupId: groupId,
            })),
          },
        },

        individualParticipants: {
          createMany: {
            data: input.individualParticipants.map((userId) => ({
              userId,
            })),
          },
        },

        year: ctx.session.user.year,
      };

      const event = await ctx.db.event.update({
        where: {
          id: input.id,
        },
        data: newEvent,
        select: EventsDTO,
      });

      return event;
    }),

  deleteEvent: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.event.delete({
        where: {
          id: input,
        },
      });

      return true;
    }),
});

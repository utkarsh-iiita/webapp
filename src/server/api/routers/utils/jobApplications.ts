import { type db } from "~/server/db";

export function getFilterQuery(filterColumn: string, filterValue: string) {
  const filters: Parameters<typeof db.application.findMany>[0]["where"] = {};
  if (filterColumn && filterValue) {
    switch (filterColumn) {
      case "username":
        filters.student = {
          user: {
            username: {
              contains: filterValue,
            },
          },
        };
        break;
      case "name":
        filters.student = {
          user: {
            name: {
              contains: filterValue,
            },
          },
        };
        break;
      case "email":
        filters.student = {
          user: {
            email: {
              contains: filterValue,
            },
          },
        };
        break;
      case "phone":
        filters.student = {
          phone: {
            contains: filterValue,
          },
        };
        break;
      case "status":
        filters.latestStatus = {
          status: filterValue as any,
        };
        break;
      case "gender":
        filters.student = {
          gender: filterValue as any,
        };
        break;
      default:
        break;
    }
  }
  return filters;
}

export const getOrderQuery = (orderBy: string, sort: string) => {
  const order: any = {};
  switch (orderBy) {
    case "name":
      order.student = {
        user: {
          name: sort,
        },
      };
      break;
    case "username":
      order.student = {
        user: {
          username: sort,
        },
      };
      break;
    case "email":
      order.student = {
        email: sort,
      };
      break;
    case "status":
      order.latestStatus = {
        status: sort,
      };
      break;
    case "gender":
      order.student = {
        gender: sort,
      };
      break;
    case "admissionYear":
      order.student = {
        admissionYear: sort,
      };
      break;
    case "createdAt":
      order.createdAt = sort;
      break;
    case "program":
      order.student = {
        program: sort,
      };
      break;
    case "cgpa":
      order.student = {
        cgpa: sort,
      };
      break;
    case "completedCredits":
      order.student = {
        completedCredits: sort,
      };
      break;
    default:
      order.createdAt = sort;
  }
  return order;
};

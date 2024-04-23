import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function ErrorInspection(e: any) {
  if (e instanceof ZodError) {
    return {
      type: "validation",
      errors: e.errors,
    };
  } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      type: "db",
      errors: [{ message: e.message }],
    };
  } else if (e instanceof Error) {
    return {
      type: "common",
      errors: [{ message: e.message }],
    };
  }
  return {
    type: "common",
    errors: [{ message: "Unknown error" }],
  };
}

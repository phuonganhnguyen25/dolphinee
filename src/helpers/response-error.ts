import { IResponse } from "@/interfaces";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

const DEFAULT_VALUE: IResponse<any> = {
  status: false,
  type: "error",
  errors: [],
  message: "",
  data: {
    data: [],
    pagination: {
      page: 0,
      per_page: 0,
      total: 0,
    },
  },
};

export function SuccessInspection<TData>(
  message: string,
  data: TData,
  pagination: IResponse<TData>["data"]["pagination"] | null
) {
  const success: IResponse<TData> = DEFAULT_VALUE;
  success.status = true;
  success.type = "success";
  success.message = message;
  success.data.data = data;
  success.data.pagination = pagination || DEFAULT_VALUE.data.pagination;
  return success;
}

export function ErrorInspection<TData>(e: any) {
  const error: IResponse<TData> = DEFAULT_VALUE;

  if (e instanceof ZodError) {
    error.type = "validation";
    error.status = false;
    error.errors = e.errors;
  } else if (
    e instanceof Prisma.PrismaClientKnownRequestError ||
    e instanceof Prisma.PrismaClientUnknownRequestError ||
    e instanceof Prisma.PrismaClientValidationError
  ) {
    error.type = "db";
    error.errors = [{ message: e.message }];
  } else if (e instanceof Error) {
    error.type = "error";
    error.errors = [{ message: e.message }];
  } else {
    error.type = "unknown";
    error.errors = [{ message: "Unknown error", e: e?.toString() }];
  }
  return error;
}

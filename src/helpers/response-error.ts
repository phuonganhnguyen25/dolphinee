import { IResponse } from "@/interfaces";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

class DEFAULT_VALUE_INSTANCE<TData> {
  private res: IResponse<TData> = {
    status: false,
    type: "error",
    errors: [],
    message: "",
    data: {
      data: null,
      pagination: {
        page: 0,
        per_page: 0,
        total: 0,
      },
    },
  };

  constructor(
    status: boolean,
    type: IResponse<any>["type"],
    errors: any,
    message: string,
    data: TData | any,
    pagination: IResponse<any>["data"]["pagination"] | {}
  ) {
    this.res = {
      ...this.res,
      status,
      type,
      errors,
      message,
      data: {
        data,
        pagination: {
          ...this.res.data.pagination,
          ...pagination,
        },
      },
    };
  }

  get() {
    return this.res;
  }
}

export function SuccessInspection<TData>(
  message: string,
  data: TData,
  pagination: IResponse<TData>["data"]["pagination"] | {}
) {
  return new DEFAULT_VALUE_INSTANCE<TData>(
    true,
    "success",
    [],
    message,
    data,
    pagination
  ).get();
}

export function ErrorInspection<TData>(e: any) {
  if (e instanceof ZodError) {
    return new DEFAULT_VALUE_INSTANCE<TData>(
      false,
      "validation",
      e.errors,
      "",
      null,
      {}
    ).get();
  } else if (
    e instanceof Prisma.PrismaClientKnownRequestError ||
    e instanceof Prisma.PrismaClientUnknownRequestError ||
    e instanceof Prisma.PrismaClientValidationError
  ) {
    return new DEFAULT_VALUE_INSTANCE<TData>(
      false,
      "db",
      [],
      e.message,
      null,
      {}
    ).get();
  } else if (e instanceof Error) {
    return new DEFAULT_VALUE_INSTANCE<TData>(
      false,
      "error",
      [],
      e.message,
      null,
      {}
    ).get();
  } else {
    return new DEFAULT_VALUE_INSTANCE<TData>(
      false,
      "unknown",
      [],
      e?.toString(),
      null,
      {}
    ).get();
  }
}

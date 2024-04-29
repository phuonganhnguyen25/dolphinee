import { ZodError } from "zod";
import { IResponse } from "@/interfaces";

export function ThrowError<T>(error: any): IResponse<T> {
  throw new Error(error);
}

export function ThrowZodError(error: any) {
  throw new ZodError(error);
}

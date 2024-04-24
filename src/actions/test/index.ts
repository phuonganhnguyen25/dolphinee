"use server";

import { ErrorInspection } from "@/helpers/response-error";
import { TestValidator } from "@/validators/test/index";

export async function TestServerAction(test: string) {
  try {
    TestValidator.parse({ test });
    // throw new Error("123")
  } catch (e: any) {
    return ErrorInspection(e)
  }
  return "Server Action";
}

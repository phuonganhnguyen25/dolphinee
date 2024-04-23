import { z } from "zod";

export const TestValidator = z.object({
  test: z.string().min(1),
});

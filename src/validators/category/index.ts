import { z } from "zod";

export const CreateCategoryValidator = z.object({
  name_en: z
    .string({ message: "Error.Required" })
    .min(1, { message: "Error.Name_Min" })
    .max(30, { message: "Error.Name_Max" }),
  name_vi: z
    .string({ message: "Error.Required" })
    .min(1, { message: "Error.Name_Min" })
    .max(30, { message: "Error.Name_Max" }),
  parent_id: z.number({ message: "Error.Required" }).min(0),
});

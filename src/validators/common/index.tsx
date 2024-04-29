import * as z from "zod";

export const nameValidationCommon = z
  .string({ message: "Error.Required" })
  .min(1, { message: "Error.Name_Min" })
  .max(30, { message: "Error.Name_Max" });

export const priceValidationCommon = z
  .number({ message: "Error.Required" })
  .min(1, { message: "Error.Price_Min" })

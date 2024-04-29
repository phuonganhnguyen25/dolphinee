import { REGEX_VALID_VI_STR, REGEX_VALID_EN_STR } from "@/constants/regex";
import { z } from "zod";
import { nameValidationCommon, priceValidationCommon } from "../common";
import { PRODUCT_STATUS } from "@prisma/client";

export const CreateProductValidator = z.object({
  name_en: nameValidationCommon.regex(REGEX_VALID_EN_STR, {
    message: "Error.Invalid_Name_En",
  }),
  name_vi: nameValidationCommon.regex(REGEX_VALID_VI_STR, {
    message: "Error.Invalid_Name_Vi",
  }),
  price_en: priceValidationCommon,
  price_vi: priceValidationCommon,
  description: z.string().optional(),
  is_new: z.boolean(),
  category_id: z.number().min(0),
});

export const GetListProductValidator = z.object({
  page: z.number().min(1),
  per_page: z.number().min(1),
  status: z.nativeEnum(PRODUCT_STATUS).optional(),
});

export const UpdateProductValidator = z.object({
  name_en: nameValidationCommon
    .regex(REGEX_VALID_EN_STR, {
      message: "Error.Invalid_Name_En",
    })
    .optional(),
  name_vi: nameValidationCommon
    .regex(REGEX_VALID_VI_STR, {
      message: "Error.Invalid_Name_Vi",
    })
    .optional(),
  price_en: priceValidationCommon.optional(),
  price_vi: priceValidationCommon.optional(),
  description: z.string({ message: "Error.Required" }).optional(),
  is_new: z.boolean({ message: "Error.Required" }).optional(),
  category_id: z.number({ message: "Error.Required" }).min(0).optional(),
});

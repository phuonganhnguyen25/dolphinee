import { REGEX_VALID_VI_STR, REGEX_VALID_EN_STR } from "@/constants/regex";
import { z } from "zod";
import { nameValidationCommon } from "../common";

export const CreateCategoryValidator = z.object({
  name_en: nameValidationCommon.regex(REGEX_VALID_EN_STR, {
    message: "Error.Invalid_Name_En",
  }),
  name_vi: nameValidationCommon.regex(REGEX_VALID_VI_STR, {
    message: "Error.Invalid_Name_Vi",
  }),
  parent_id: z.number({ message: "Error.Required" }).min(0),
});

export const UpdateCategoryValidator = z.object({
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
  parent_id: z.number({ message: "Error.Required" }).min(0).optional(),
});

"use server";

import { ErrorInspection, SuccessInspection } from "@/helpers/response-error";
import { IUpdateCategoryPayload } from "@/interfaces/category";
import { UpdateCategoryValidator } from "@/validators/category";
import {
  CheckCategoryName,
  OnGetCategoryById,
  OnMoveChildCategory,
  OnUpdateCategory,
} from ".";
import { keys, pick } from "lodash";
import { ThrowError, ThrowZodError } from "@/helpers/throw-error";

export async function UpdateCategoryAction(body: IUpdateCategoryPayload) {
  try {
    UpdateCategoryValidator.parse(body);

    const name_keys = keys(pick(body, ["name_en", "name_vi"]));

    if (name_keys.length) {
      const dupName = await CheckCategoryName(body);
      if (dupName.length) {
        const arr: any = [];
        dupName.map((x) => {
          arr.push({ path: [x], message: "Error.Name_Invalid" });
        });

        ThrowZodError(arr);
      }
    }

    const update_body: any = {};

    if (!body.id) return ThrowError<object>("Error.Update_Category");

    const existing = await OnGetCategoryById(body.id);
    if (existing) {
      update_body.name = existing.name;
    }

    name_keys.map((key) => {
      const value: any = body;
      update_body.name[key] = value[key];
    });

    if ("parent_id" in body) {
      update_body["parent_id"] = body.parent_id === 0 ? null : body.parent_id;
    }

    const res = await OnUpdateCategory(update_body, body.id);
    if (!res) return ThrowError<object>("Error.Update_Category");

    if (existing?.children?.length && body.parent_id) {
      await OnMoveChildCategory(
        existing.children.map((x) => x.id),
        body.parent_id,
      );
    }

    return SuccessInspection<object>("Success.Update_Category", body, {});
  } catch (e: any) {
    return ErrorInspection<object>(e);
  }
}

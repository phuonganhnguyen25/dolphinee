"use server";

import { ErrorInspection, SuccessInspection } from "@/helpers/response-error";
import { ICreateCategoryPayload } from "@/interfaces/category";
import { CreateCategoryValidator } from "@/validators/category";
import { CheckCategoryName, NewestCategoryOrder, OnCreateCategory } from ".";
import { ThrowZodError } from "@/helpers/throw-error";

export async function CreateCategoryAction(body: ICreateCategoryPayload) {
  try {
    CreateCategoryValidator.parse(body);

    const dupName = await CheckCategoryName(body);
    if (dupName.length) {
      const arr: any = [];
      dupName.map((x) => {
        arr.push({ path: [x], message: "Error.Name_Invalid" });
      });
      ThrowZodError(arr);
    }

    const order = await NewestCategoryOrder();
    const level = body.parent_id ? 2 : 1;

    await OnCreateCategory({
      ...body,
      order,
      level,
    });

    return SuccessInspection<any>("Success.Create_Category", 1, {});
  } catch (e: any) {
    return ErrorInspection<any>(e);
  }
}

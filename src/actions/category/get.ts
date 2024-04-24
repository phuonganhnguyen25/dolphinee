"use server";

import { ErrorInspection, SuccessInspection } from "@/helpers/response-error";
import { OnGetListCategoryWithLevel, OnGetListCategoryAllLevel } from ".";
import { ICategory } from "@/interfaces/category";

export async function GetListCategoryLevel1() {
  try {
    const res: any = await OnGetListCategoryWithLevel(1);
    return SuccessInspection<ICategory[]>(
      "Success.Get_List_Category",
      res,
      null
    );
  } catch (e: any) {
    return ErrorInspection<ICategory[]>(e);
  }
}

export async function GetListCategoryAllLevel() {
  try {
    const res: any = await OnGetListCategoryAllLevel();
    return SuccessInspection<ICategory[]>(
      "Success.Get_List_Category",
      res,
      null
    );
  } catch (e: any) {
    return ErrorInspection<ICategory[]>(e);
  }
}

"use server";

import { ErrorInspection, SuccessInspection } from "@/helpers/response-error";
import {
  OnGetListCategoryWithLevel,
  OnGetListCategoryAllLevel,
  OnGetCategoryById,
} from ".";
import { ICategory } from "@/interfaces/category";

export async function GetListSelectCategoryLevel1() {
  try {
    const select_category = [{ label: "-", value: 0 }];
    const categories = await OnGetListCategoryWithLevel(1);

    const res: any = categories.map((item: any) => ({
      label: `${item.name.name_en}/${item.name.name_vi}`,
      value: item.id,
    }));

    return SuccessInspection<{ label: string; value: number }[]>(
      "Success.Get_List_Category",
      [...select_category, ...res],
      {}
    );
  } catch (e: any) {
    return ErrorInspection<{ label: string; value: number }[]>(e);
  }
}

export async function GetListSelectCategoryAllLevelAction() {
  try {
    const select_category = [{ label: "-", value: 0 }];
    const categories = await OnGetListCategoryAllLevel();

    const res: any = categories.map((item: any) => ({
      label: `${item.name.name_en}/${item.name.name_vi}`,
      value: item.id,
    }));

    return SuccessInspection<{ label: string; value: number }[]>(
      "Success.Get_List_Category",
      [...select_category, ...res],
      {}
    );
  } catch (e: any) {
    return ErrorInspection<{ label: string; value: number }[]>(e);
  }
}

export async function GetListCategoryLevel1() {
  try {
    const res: any = await OnGetListCategoryWithLevel(1);
    return SuccessInspection<ICategory[]>(
      "Success.Get_List_Category",
      res,
      {}
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
      {}
    );
  } catch (e: any) {
    return ErrorInspection<ICategory[]>(e);
  }
}

export async function GetCategoryById(id: number) {
  try {
    const res: any = await OnGetCategoryById(id);
    return SuccessInspection<ICategory>("Success.Get_Category", res, {});
  } catch (e: any) {
    return ErrorInspection<ICategory>(e);
  }
}

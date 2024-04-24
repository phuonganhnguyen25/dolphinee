import { Category } from "@prisma/client";
import { IDBFieldName } from ".";

export interface ICategory
  extends Pick<
    Category,
    "id" | "created_at" | "level" | "order" | "updated_at"
  > {
  name: IDBFieldName;
  parent?: ICategory;
  children: ICategory[];
  _count?: {
    children: number;
  };
}

export interface ICreateCategoryPayload
  extends Pick<ICategory["name"], "name_en" | "name_vi"> {
  parent_id: number;
}

export interface IUpdateCategoryPayload {
  id?: number;
  name_en?: string;
  name_vi?: string;
  parent_id?: number;
}

export interface IChangeCategoryOrderPayload {
  category_id: ICategory["id"];
  next_order: number;
}

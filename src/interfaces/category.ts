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
}

export interface ICreateCategoryPayload
  extends Pick<ICategory["name"], "name_en" | "name_vi"> {
  parent_id: number;
}

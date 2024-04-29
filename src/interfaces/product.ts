import { Product, PRODUCT_STATUS } from "@prisma/client";
import { IDBFieldName, IPagination } from ".";
import { ICategory } from "@/interfaces/category";

export interface IProduct
  extends Pick<
    Product,
    | "id"
    | "created_at"
    | "updated_at"
    | "description"
    | "sku"
    | "status"
    | "is_new"
  > {
  name: IDBFieldName;
  price_en: number;
  price_vi: number;
  product_category: {
    id: number;
    category: ICategory;
  };
}

export interface ICreateProductPayload
  extends Pick<IProduct["name"], "name_en" | "name_vi">,
    Pick<IProduct, "price_en" | "price_vi" | "description" | "is_new"> {
  category_id: number;
}

export interface IUpdateProductPayload extends Partial<ICreateProductPayload> {
  id: number;
}

export interface IGetListProductPayload
  extends Pick<IPagination, "page" | "per_page">,
    Partial<{ status: PRODUCT_STATUS | undefined }> {}
